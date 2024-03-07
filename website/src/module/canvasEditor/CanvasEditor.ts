import { debounce } from '@/util';
import { CanvasConfig, CanvasContext, RenderingContext, ICanvas, IPlugin } from './interface';
import { Group } from './Drawable/Group';
import { Vector2 } from './util';
import { RenderingSystem, EventSystem } from './systems';
import { DisplayObject } from './DisplayObject';
import { CanvasKitRendererPlguin, EventPlugin } from './plugins';
import { CanvasKitContextSystem } from './systems/CanvasKitContextSystem';

export class CanvasEditor implements ICanvas {
  container: HTMLElement;
  canvasEl: HTMLCanvasElement;

  private resizeObserver: ResizeObserver;

  root: Group;

  plugins: IPlugin[] = [];

  private context = {} as CanvasContext;
  private animateID: number | undefined;

  constructor(options: CanvasConfig) {
    const {
      container,
      canvasEl,
      width,
      height,
      devicePixelRatio = window.devicePixelRatio,
      supportsCSSTransform = false,
      supportsPointerEvents = true,
      supportsTouchEvents = false,
    } = options;

    const root = new Group();
    root.ownerCanvas = this;
    this.root = root;

    this.container = container;

    container.style.touchAction = 'none';

    if (canvasEl) {
      this.canvasEl = canvasEl;
      if (container && canvasEl.parentElement !== container) {
        container.appendChild(canvasEl);
      }
    } else if (container) {
      const canvasEl = document.createElement('canvas');
      container.appendChild(canvasEl);
      this.canvasEl = canvasEl;
    } else {
      throw new Error('need canvasEl or container');
    }

    let canvasWidth = width || -1;
    let canvasHeight = height || -1;

    if (canvasEl) {
      canvasWidth = width || canvasEl.offsetWidth || canvasEl.width / devicePixelRatio;
      canvasHeight = height || canvasEl.offsetHeight || canvasEl.height / devicePixelRatio;
    }

    this.context.config = {
      canvasEl: this.canvasEl,
      container: this.container,
      width: canvasWidth,
      height: canvasHeight,
      devicePixelRatio,
      supportsCSSTransform,
      supportsPointerEvents,
      supportsTouchEvents,
    };

    // init context, then init systems, finally init plugins
    this.initRenderContext();

    this.initRenderer();

    // plugins.apply will hook to renderSystem.hooks
    this.plugins.push(new EventPlugin(), new CanvasKitRendererPlguin());
    this.plugins.forEach((a) => a.apply(this.context));

    const debouncedResize = debounce(this.resize);

    // observe container's resize event
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      debouncedResize(width, height);
    });

    resizeObserver.observe(this.container);
    this.resizeObserver = resizeObserver;
  }

  private initRenderContext = () => {
    const renderContext: RenderingContext = {
      root: this.root,
      renderListCurrentFrame: [],
    };

    this.context.renderingContext = renderContext;
  };

  private initRenderer = () => {
    this.context.renderingSystem = new RenderingSystem(this.context);
    this.context.eventSystem = new EventSystem(this.context);
    this.context.contextSystem = new CanvasKitContextSystem(this.context);

    this.context.eventSystem.init();

    if (this.context.contextSystem.init) {
      this.context.contextSystem.init();
      this.initRenderSystem();
    } else if (this.context.contextSystem.initAsync) {
      this.context.contextSystem.initAsync().then(() => {
        this.initRenderSystem();
      });
    } else {
      throw new Error('contextSystem must has init() or initAsync()s');
    }
  };

  private initRenderSystem = () => {
    this.context.renderingSystem.init();
    this.run();
  };

  private run() {
    const tick = () => {
      this.getRendererSystem().render();
      this.animateID = requestAnimationFrame(tick);
    };
    tick();
  }

  private resize = (width: number, height: number) => {
    const config = this.context.config;
    config.width = width;
    config.height = height;
    this.getContextSystem().resize(width, height);
  };

  createElement = <T extends DisplayObject>(ctor: new (context: CanvasContext) => T) => {
    const obj = new ctor(this.context);
    obj.ownerCanvas = this;

    return obj;
  };

  viewport2Canvas: (point: Vector2) => Vector2 = (point) => {
    return this.root.worldToTranform(point);
  };

  canvasToViewPort: (point: Vector2) => Vector2 = (point) => {
    return this.root.transformToWorld(point);
  };

  getEventSystem = () => this.context.eventSystem;
  getRendererSystem = () => this.context.renderingSystem;
  getContextSystem = () => this.context.contextSystem;

  getConfig = () => this.context.config;

  dispose = () => {
    this.resizeObserver.unobserve(this.container);
    this.container.removeChild(this.canvasEl);
    this.context.renderingSystem.dispose();
    this.animateID && cancelAnimationFrame(this.animateID);
  };
}
