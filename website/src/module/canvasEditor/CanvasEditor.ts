import { Canvas, CanvasKit, GrDirectContext, Surface } from 'canvaskit-wasm';
import { IDrawable } from './IDrawable';
import { debounce } from '@/util';
import { EventName, UIEvent } from './types';
import { DrawableObject } from './DrawableObject';

export interface CanvasEditorOptions {
  containerId: string;
}

export class CanvasEditor {
  parentEl: HTMLElement;
  canvasEl: HTMLCanvasElement;

  private resizeObserver: ResizeObserver;

  canvaskit: CanvasKit;
  context: GrDirectContext;
  surface!: Surface;

  private isDirty = false;
  private animateID = -1;

  private children: DrawableObject[] = [];

  constructor(canvaskit: CanvasKit, options: CanvasEditorOptions) {
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

    // register ui events
    this.canvasEl.addEventListener('click', this.handleEvent('click'));
    this.canvasEl.addEventListener('pointerdown', this.handleEvent('pointerdown'));
    this.canvasEl.addEventListener('pointermove', this.handleEvent('pointermove'));
    this.canvasEl.addEventListener('pointerover', this.handleEvent('pointerover'));
    this.canvasEl.addEventListener('pointerup', this.handleEvent('pointerup'));

    this.drawFrame();
  }

  addChild = (drawable: DrawableObject) => {
    this.children.push(drawable);
  };

  removeChild = (drawable: DrawableObject) => {
    const index = this.children.findIndex((a) => a === drawable);
    if (index === -1) {
      console.warn('drawable is not exit');
      return;
    }

    this.children.splice(index, 1);
  };

  private draw: (canvas: Canvas) => void = (canvas) => {
    this.children.forEach((a) => a.draw(canvas));
  };

  private drawFrame = () => {
    this.animateID = requestAnimationFrame(() => this.drawFrame());
    // if (!this.isDirty) return;
    const canvas = this.surface.getCanvas();
    // reset matrix
    canvas.concat(this.canvaskit.Matrix.invert(canvas.getTotalMatrix())!);

    canvas.scale(devicePixelRatio, devicePixelRatio); // physical pixels to CSS pixels

    this.draw(canvas);
    // ??
    this.surface.flush();
    this.isDirty = false;
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

  // ui event
  handleEvent = (name: EventName) => (event: MouseEvent) => {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;
    const e: UIEvent = {
      pos: {
        x: offsetX,
        y: offsetY,
      },
      isStopCapturing: false,
    };
    for (const c of this.children) {
      if (c.isPointIn(e.pos) && !e.isStopCapturing) {
        c.emit(name, e);
      }
    }
  };

  dispose = () => {
    this.resizeObserver.unobserve(this.parentEl);
    this.parentEl.removeChild(this.canvasEl);

    cancelAnimationFrame(this.animateID);
  };
}
