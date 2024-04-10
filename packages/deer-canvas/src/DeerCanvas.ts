import { debounce, isNil, isString } from '@/util';
import {
  CanvasConfig,
  CanvasContext,
  RenderingContext,
  ICanvas,
  IRenderingPlugin,
  DisplayObjectConfig,
  BaseStyleProps,
} from './interface';
import { Group } from './drawable';
import { Vector2 } from './util';
import { RenderingSystem, EventSystem } from './systems';
import { DisplayObject } from './core/DisplayObject';
import { EventPlugin, Canvas2DRendererPlugin, CullingPlugin, CoordinatePlugin, ControlPlugin } from './plugins';
import { Camera, ClipSpaceNearZ, ICamera } from './camera';
import { Canvas2DContextSystem } from './plugins/plugin-canvas2d-renderer/Canvas2dContextSystem';
import { mat4, vec3 } from 'gl-matrix';

const DEFAULT_CAMERA_Z = 500;
const DEFAULT_CAMERA_NEAR = 0.1;
const DEFAULT_CAMERA_FAR = 1000;

export class DeerCanvas implements ICanvas {
  container: HTMLElement;
  canvasEl: HTMLCanvasElement;

  // private resizeObserver: ResizeObserver;

  root: Group;
  camera!: ICamera;

  plugins: IRenderingPlugin[] = [];

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

    const root = new Group({
      id: 'root',
      name: 'root',
    });
    root.ownerCanvas = this;
    this.root = root;

    if (isString(container)) {
      const c = document.getElementById(container);
      if (isNil(c)) throw new Error(`cannot find HTMLElement(id= ${container})`);
      this.container = c;
    } else this.container = container;

    this.container.style.touchAction = 'none';

    if (canvasEl) {
      this.canvasEl = canvasEl;
      if (container && canvasEl.parentElement !== container) {
        this.container.appendChild(canvasEl);
      }
    } else if (container) {
      const canvasEl = document.createElement('canvas');
      this.container.appendChild(canvasEl);
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

    this.initCamera(canvasWidth, canvasHeight, ClipSpaceNearZ.NEGATIVE_ONE);

    this.initRenderer();

    const debouncedResize = debounce(this.resize);

    // observe container's resize event
    // const resizeObserver = new ResizeObserver((entries) => {
    //   const { width, height } = entries[0].contentRect;
    //   debouncedResize(width, height);
    // });

    // resizeObserver.observe(this.container);
    // this.resizeObserver = resizeObserver;
  }

  private initRenderContext = () => {
    const renderContext: RenderingContext = {
      root: this.root,
    };

    this.context.renderingContext = renderContext;
  };

  private initCamera = (width: number, height: number, clipSpaceNearZ: ClipSpaceNearZ) => {
    const camera = new Camera(this);
    camera.clipSpaceNearZ = clipSpaceNearZ;
    camera
      .setPosition(width / 2, height / 2, DEFAULT_CAMERA_Z)
      .setFocalPoint(width / 2, height / 2, 0)
      .setOrthographic(-width / 2, width / 2, height / 2, -height / 2, DEFAULT_CAMERA_NEAR, DEFAULT_CAMERA_FAR);
    this.camera = camera;

    this.context.camera = camera;
  };

  private initRenderer = () => {
    this.context.renderingSystem = new RenderingSystem(this.context);
    this.context.eventSystem = new EventSystem(this.context);
    this.context.contextSystem = new Canvas2DContextSystem(this.context);

    this.context.eventSystem.init();

    if (this.context.contextSystem.init) {
      this.context.contextSystem.init();
      this.initRenderingSystem();
    } else if (this.context.contextSystem.initAsync) {
      this.context.contextSystem.initAsync().then(() => {
        this.initRenderingSystem();
      });
    } else {
      throw new Error('contextSystem must has init() or initAsync()');
    }
  };

  private initRenderingSystem = () => {
    // plugins.apply will hook to renderSystem.hooks
    this.plugins.push(
      new EventPlugin(),
      new CullingPlugin(),
      new Canvas2DRendererPlugin(),
      new CoordinatePlugin(),
      new ControlPlugin()
    );
    this.plugins.forEach((a) => a.apply(this.context));

    this.context.renderingSystem.init();
    this.run();
  };

  private run = () => {
    const tick = () => {
      this.getRendererSystem().render();
      this.animateID = requestAnimationFrame(tick);
    };
    tick();
  };

  private resize = (width: number, height: number) => {
    const config = this.context.config;
    config.width = width;
    config.height = height;
    this.getContextSystem().resize(width, height);
  };

  createElement = <T extends DisplayObject, StyleProps extends BaseStyleProps>(
    ctor: new (config: DisplayObjectConfig<StyleProps>) => T,
    config: DisplayObjectConfig<StyleProps>
  ) => {
    const obj = new ctor(config);
    obj.ownerCanvas = this;

    return obj;
  };

  private tmpMat4 = mat4.create();
  private tmpVec3 = vec3.create();

  viewport2Canvas: (point: Vector2) => Vector2 = (point) => {
    const camera = this.camera;
    const { width, height } = this.context.config;

    const w = camera.WorldTransform;
    const pi = camera.ProjectionInverse;
    const piw = mat4.multiply(this.tmpMat4, w, pi);

    // viewport -> NDC -> clip. Flip Y.
    const clip = vec3.set(this.tmpVec3, (point.x / width) * 2 - 1, (1 - point.y / height) * 2 - 1, 0);
    // clip -> view -> world
    const world = vec3.transformMat4(clip, clip, piw);

    return { x: world[0], y: world[1] };
  };

  canvas2Viewport: (point: Vector2) => Vector2 = (point) => {
    const camera = this.camera;
    const { width, height } = this.context.config;

    const v = camera.ViewTransform;
    const p = camera.ProjectionMatrix;
    const vp = mat4.multiply(this.tmpMat4, p, v);

    const clip = vec3.set(this.tmpVec3, point.x, point.y, 0);
    // world -> view -> clip
    vec3.transformMat4(clip, clip, vp);
    // clip(-1 ~ 1) -> NDC -> viewport. Flip Y
    return {
      x: ((clip[0] + 1) / 2) * width,
      y: (1 - (clip[1] + 1) / 2) * height,
    };
  };

  client2Viewport = (client: Vector2) => {
    const bbox = this.canvasEl?.getBoundingClientRect();
    return { x: client.x - (bbox?.left || 0), y: client.y - (bbox?.top || 0) };
  };

  viewport2Client = (viewport: Vector2) => {
    const bbox = this.canvasEl?.getBoundingClientRect();
    return { x: viewport.x + (bbox?.left || 0), y: viewport.y + (bbox?.top || 0) };
  };

  getEventSystem = () => this.context.eventSystem;
  getRendererSystem = () => this.context.renderingSystem;
  getContextSystem = () => this.context.contextSystem;

  getConfig = () => this.context.config;

  dispose = () => {
    //  this.resizeObserver.unobserve(this.container);
    this.container.removeChild(this.canvasEl);
    this.context.renderingSystem.dispose();
    this.animateID && cancelAnimationFrame(this.animateID);
  };
}
