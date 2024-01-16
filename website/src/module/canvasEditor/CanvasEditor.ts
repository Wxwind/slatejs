import { Canvas, CanvasKit, GrDirectContext, Surface } from 'canvaskit-wasm';
import { IDrawable } from './IDrawable';
import { debounce } from '@/util';

export interface CavansEditorOptions {
  containerId: string;
}

export class CavansEditor {
  parentEl: HTMLElement;
  canvasEl: HTMLCanvasElement;

  private resizeObserver: ResizeObserver;

  canvaskit: CanvasKit;
  context: GrDirectContext;
  surface!: Surface;

  private isDirty = false;
  private animateID = -1;

  private drawables: IDrawable[] = [];

  constructor(canvaskit: CanvasKit, options: CavansEditorOptions) {
    this.canvaskit = canvaskit;
    const { containerId } = options;
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
    this.context = context;

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

  addDrawables = (drawable: IDrawable) => {
    this.drawables.push(drawable);
  };

  removeDrawables = (drawable: IDrawable) => {
    const index = this.drawables.findIndex((a) => a === drawable);
    if (index === -1) {
      console.warn('drawable is not exit');
      return;
    }

    this.drawables.splice(index, 1);
  };

  draw: (canvas: Canvas) => void = (canvas) => {
    this.drawables.forEach((a) => a.draw(canvas));
  };

  private drawFrame = () => {
    if (this.isDirty) {
      const canvas = this.surface.getCanvas();
      // reset matrix
      canvas.concat(this.canvaskit.Matrix.invert(canvas.getTotalMatrix())!);

      canvas.scale(devicePixelRatio, devicePixelRatio); // physical pixels to CSS pixels

      this.draw(canvas);
      // ??
      this.surface.flush();
      this.isDirty = false;
    }
    this.animateID = requestAnimationFrame(() => this.drawFrame());
  };

  private resize = (width: number, height: number) => {
    this.canvasEl.width = width * devicePixelRatio; // CSS pixels to physical pixels
    this.canvasEl.height = height * devicePixelRatio;

    const surface = this.canvaskit.MakeOnScreenGLSurface(
      this.context,
      width * devicePixelRatio,
      height * devicePixelRatio,
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
