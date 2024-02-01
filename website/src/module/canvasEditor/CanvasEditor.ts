import { Canvas, CanvasKit, GrDirectContext, Surface } from 'canvaskit-wasm';
import { debounce, throttle } from '@/util';
import { EventName } from './types';
import { DrawableObject } from './DrawableObject';
import { Group } from './Drawable/Group';
import { FederatedEvent } from './events';

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

  private pixelRatio: number;

  private isDirty = false;
  private animateID = -1;

  private root: Group = new Group();

  constructor(canvaskit: CanvasKit, options: CanvasEditorOptions) {
    this.canvaskit = canvaskit;
    this.pixelRatio = window.devicePixelRatio;
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
    this.canvasEl.addEventListener('pointermove', throttle(this.handleEvent('pointermove')));
    this.canvasEl.addEventListener('pointerover', this.handleEvent('pointerover'));
    window.addEventListener('pointerup', this.handleEvent('pointerup'));
    this.canvasEl.addEventListener('pointerout', this.handleEvent('pointerout'));
    this.canvasEl.addEventListener('wheel', throttle(this.handleEvent('wheel')));
    this.drawFrame();
  }

  addChild = (drawable: DrawableObject) => {
    this.root.addChild(drawable);
  };

  removeChild = (drawable: DrawableObject) => {
    this.root.removeChild(drawable);
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

    canvas.scale(this.pixelRatio, this.pixelRatio); // physical pixels to CSS pixels

    this.render(canvas);
    // ??
    this.surface.flush();
    this.isDirty = false;
  };

  private resize = (width: number, height: number) => {
    this.canvasEl.width = width * this.pixelRatio; // CSS pixels to physical pixels
    this.canvasEl.height = height * this.pixelRatio;

    const surface = this.canvaskit.MakeOnScreenGLSurface(
      this.context,
      width * this.pixelRatio,
      height * this.pixelRatio,
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
    const e = new FederatedEvent();

    e.pos = {
      x: offsetX,
      y: offsetY,
    };

    for (const c of this.root.children) {
      if (c.isPointHit(e.pos) && !e.isStopBubble) {
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
