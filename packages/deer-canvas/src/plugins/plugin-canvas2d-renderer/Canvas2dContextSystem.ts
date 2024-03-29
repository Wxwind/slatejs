import { CanvasConfig, CanvasContext } from '@/interface';
import { ContextSystem } from '@/systems';

export class Canvas2DContextSystem implements ContextSystem<CanvasRenderingContext2D> {
  private dpr!: number;
  private canvasEl!: HTMLCanvasElement;
  private canvas2D!: CanvasRenderingContext2D;

  private config: Required<CanvasConfig>;

  constructor(context: CanvasContext) {
    this.config = context.config;
  }

  init = () => {
    const { canvasEl, devicePixelRatio, width, height } = this.config;
    this.dpr = devicePixelRatio;
    this.canvasEl = canvasEl;

    this.canvas2D = canvasEl.getContext('2d')!;

    this.resize(width, height);
  };

  dispose = () => {
    return;
  };

  resize = (width: number, height: number) => {
    this.canvasEl.style.width = width + 'px';
    this.canvasEl.style.height = height + 'px';
    const canvasEl = this.canvasEl;
    canvasEl.width = width * this.dpr; // CSS pixels to physical pixels
    canvasEl.height = height * this.dpr;
  };

  getContext = () => this.canvas2D;
  getCanvasElement = () => this.canvasEl;
}
