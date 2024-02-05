import { Canvas, CanvasKit, GrDirectContext, Surface } from 'canvaskit-wasm';
import { debounce } from '@/util';
import { CanvasConfig, CanvasContext, ICanvas } from './types';
import { DrawableObject } from './DrawableObject';
import { Group } from './Drawable/Group';
import { IPlugin } from './Plugin';
import { EventPlugin } from './events';
import { Vector2 } from './util';

export class CanvasEditor implements ICanvas {
  parentEl: HTMLElement;
  canvasEl: HTMLCanvasElement;

  private resizeObserver: ResizeObserver;

  canvaskit: CanvasKit;
  grContext: GrDirectContext;
  surface!: Surface;

  supportsTouchEvents = false;
  supportsPointerEvents = true;

  devicePixelRatio: number;

  private isDirty = false;
  private animateID = -1;

  root: Group = new Group();

  context: CanvasContext;

  plugins: IPlugin[] = [];

  constructor(canvaskit: CanvasKit, options: CanvasConfig) {
    this.canvaskit = canvaskit;
    const {
      containerId,
      devicePixelRatio = window.devicePixelRatio,
      supportsCSSTransform = false,
      supportsPointerEvents = true,
      supportsTouchEvents = false,
    } = options;

    this.devicePixelRatio = devicePixelRatio;
    this.supportsPointerEvents = supportsPointerEvents;
    this.supportsTouchEvents = supportsTouchEvents;

    this.context = {
      canvas: this,
      config: { containerId, devicePixelRatio, supportsCSSTransform, supportsPointerEvents, supportsTouchEvents },
    };

    this.plugins.push(new EventPlugin());
    this.plugins.forEach((p) => p.init(this.context));

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

    const context = canvaskit.MakeWebGLContext(canvaskit.GetWebGLContext(canvasEl));
    if (!context) {
      throw new Error('Failed to configure WebGl canvas context');
    }
    this.grContext = context;

    const debouncedResize = debounce(this.resize);

    // observe resize
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      debouncedResize(width, height);
    });

    resizeObserver.observe(this.parentEl);
    this.resizeObserver = resizeObserver;

    this.resize(this.parentEl.clientWidth, this.parentEl.clientHeight);

    this.drawFrame();
  }

  addChild = (drawable: DrawableObject) => {
    this.root.addChild(drawable);
  };

  removeChild = (drawable: DrawableObject) => {
    this.root.removeChild(drawable);
  };

  // TODO
  viewport2Canvas: (point: Vector2) => Vector2 = (point) => {
    return {
      x: 0,
      y: 0,
    };
  };

  private render: (canvas: Canvas) => void = (canvas) => {
    this.root.render(canvas);
  };

  private drawFrame = () => {
    this.animateID = this.surface.requestAnimationFrame(() => this.drawFrame());
    // if (!this.isDirty) return;
    const canvas = this.surface.getCanvas();
    // reset matrix
    canvas.concat(this.canvaskit.Matrix.invert(canvas.getTotalMatrix())!);

    canvas.scale(this.devicePixelRatio, this.devicePixelRatio); // physical pixels to CSS pixels

    this.render(canvas);
    // ??
    this.surface.flush();
    this.isDirty = false;
  };

  private resize = (width: number, height: number) => {
    this.canvasEl.width = width * this.devicePixelRatio; // CSS pixels to physical pixels
    this.canvasEl.height = height * this.devicePixelRatio;

    const surface = this.canvaskit.MakeOnScreenGLSurface(
      this.grContext,
      width * this.devicePixelRatio,
      height * this.devicePixelRatio,
      this.canvaskit.ColorSpace.SRGB
    );
    if (!surface) {
      throw new Error('Failed to initialize current swapchain Surface');
    }
    this.surface = surface;

    this.setDirty();
  };

  protected setDirty = () => {
    this.isDirty = true;
  };

  dispose = () => {
    this.resizeObserver.unobserve(this.parentEl);
    this.parentEl.removeChild(this.canvasEl);

    cancelAnimationFrame(this.animateID);
  };
}
