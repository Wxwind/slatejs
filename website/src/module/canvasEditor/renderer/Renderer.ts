import { Canvas, CanvasKit, Surface } from 'canvaskit-wasm';
import { CanvasContext, IRenderer } from '../interface';
import { ICanvas } from '../interface';
import { Group } from '..';

export class Renderer implements IRenderer {
  CanvasKit: CanvasKit;
  surface: Surface;
  dpr: number;

  private animateID = -1;
  private isDirty = false;

  canvas: ICanvas;
  root: Group;

  constructor(context: CanvasContext, CanvasKit: CanvasKit) {
    const { canvas, config, canvasEl, root } = context;
    const { devicePixelRatio = 1 } = config;
    this.dpr = devicePixelRatio;
    this.canvas = canvas;
    this.CanvasKit = CanvasKit;

    this.root = root;
    console.log('init', canvasEl.width, canvasEl.height);

    const surface = this.CanvasKit.MakeWebGLCanvasSurface(canvasEl);
    if (!surface) {
      throw new Error('Failed to initialize current swapchain Surface');
    }
    this.surface = surface;

    this.surface.requestAnimationFrame(this.requestRender);
  }

  dispose = () => {
    cancelAnimationFrame(this.animateID);
  };

  resize = (width: number, height: number) => {
    const canvasEl = this.canvas.canvasEl;
    canvasEl.width = width * this.dpr; // CSS pixels to physical pixels
    canvasEl.height = height * this.dpr;

    const surface = this.CanvasKit.MakeWebGLCanvasSurface(canvasEl);
    if (!surface) {
      throw new Error('Failed to initialize current swapchain Surface');
    }
    this.surface = surface;

    this.setDirty();
  };

  private render: (canvas: Canvas) => void = (canvas) => {
    // reset matrix
    canvas.save();

    canvas.scale(this.dpr, this.dpr); // physical pixels to CSS pixels
    this.root.render(canvas);

    canvas.restore();

    this.isDirty = false;
  };

  private requestRender = () => {
    if (true) {
      const canvas = this.surface.getCanvas();
      this.render(canvas);
    }
    this.animateID = this.surface.requestAnimationFrame(() => this.requestRender());
  };

  setDirty = () => {
    this.isDirty = true;
  };
}
