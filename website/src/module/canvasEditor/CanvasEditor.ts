import { Canvas, CanvasKit, GrDirectContext, Surface } from 'canvaskit-wasm';
import { debounce } from '@/util';
import { CanvasConfig, ICanvas, IRenderer, RenderingPluginContext } from './interface';
import { Group } from './Drawable/Group';
import { IPlugin } from './interface';
import { EventPlugin } from './events';
import { Vector2 } from './util';
import { Renderer } from './renderer';

export class CanvasEditor implements ICanvas {
  parentEl: HTMLElement;
  canvasEl: HTMLCanvasElement;

  private resizeObserver: ResizeObserver;

  root: Group = new Group();

  plugins: IPlugin[] = [];

  renderer: IRenderer;

  constructor(canvaskit: CanvasKit, options: CanvasConfig) {
    const {
      containerId,
      devicePixelRatio = window.devicePixelRatio,
      supportsCSSTransform = false,
      supportsPointerEvents = true,
      supportsTouchEvents = false,
    } = options;

    const container = document.getElementById(containerId);
    if (container) {
      this.parentEl = container;
    } else {
      throw new Error(`找不到id为${containerId}的dom节点`);
    }

    container.style.touchAction = 'none';

    const canvasEl = document.createElement('canvas');
    canvasEl.style.width = '100%';
    canvasEl.style.height = '100%';
    this.canvasEl = canvasEl;

    container.appendChild(canvasEl);

    const debouncedResize = debounce(this.resize);

    const context: RenderingPluginContext = {
      canvas: this,
      config: { containerId, devicePixelRatio, supportsCSSTransform, supportsPointerEvents, supportsTouchEvents },
      canvasEl: canvasEl,
      root: this.root,
    };

    this.plugins.push(new EventPlugin());
    this.plugins.forEach((p) => p.init(context));

    this.renderer = new Renderer(context, canvaskit);

    // observe resize
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      debouncedResize(width, height);
    });

    resizeObserver.observe(this.parentEl);
    this.resizeObserver = resizeObserver;

    this.resize(this.parentEl.clientWidth, this.parentEl.clientHeight);
  }

  viewport2Canvas: (point: Vector2) => Vector2 = (point) => {
    return this.root.worldToTranform(point);
  };

  canvasToViewPort: (point: Vector2) => Vector2 = (point) => {
    return this.root.transformToWorld(point);
  };

  private resize = (width: number, height: number) => {
    this.renderer.resize(width, height);
  };

  dispose = () => {
    this.resizeObserver.unobserve(this.parentEl);
    this.parentEl.removeChild(this.canvasEl);
    this.renderer.dispose();
  };
}
