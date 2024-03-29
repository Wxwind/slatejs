import CanvasKitInit, { CanvasKit } from 'canvaskit-wasm';
import { CanvasKitContext } from './interface';
import { ContextSystem } from '../../systems/ContextSystem';
import { CanvasConfig, CanvasContext } from '../../interface';

export class CanvasKitContextSystem implements ContextSystem<CanvasKitContext> {
  private dpr!: number;
  private context!: CanvasKitContext;
  private canvasEl!: HTMLCanvasElement;

  private config: Required<CanvasConfig>;

  constructor(context: CanvasContext) {
    this.config = context.config;
  }

  async initAsync() {
    const { canvasEl, devicePixelRatio, width, height } = this.config;
    this.dpr = devicePixelRatio;

    this.canvasEl = canvasEl;

    const CanvasKit = await this.initCanvasKit();

    const surface = CanvasKit.MakeWebGLCanvasSurface(canvasEl);
    if (!surface) {
      throw new Error('Failed to initialize current swapchain Surface');
    }

    this.resize(width, height);

    this.context = {
      surface,
      CanvasKit,
    };
  }

  dispose = () => {
    return;
  };

  resize = (width: number, height: number) => {
    this.canvasEl.style.width = width + 'px';
    this.canvasEl.style.height = height + 'px';
    const canvasEl = this.canvasEl;
    canvasEl.width = width * this.dpr; // CSS pixels to physical pixels
    canvasEl.height = height * this.dpr;

    const surface = this.context.CanvasKit.MakeWebGLCanvasSurface(canvasEl);
    if (!surface) {
      throw new Error('Failed to initialize current swapchain Surface');
    }
    this.context.surface = surface;
  };

  getContext = () => {
    return this.context;
  };

  getCanvasElement: () => HTMLCanvasElement = () => {
    return this.canvasEl;
  };

  private initCanvasKit: () => Promise<CanvasKit> = () => {
    return CanvasKitInit({
      locateFile: (file) => {
        console.log('file', file);
        // https://libs.cdnjs.net/canvaskit-wasm/0.39.1/
        return 'https://libs.cdnjs.net/canvaskit-wasm/0.39.1/' + file;
      },
    });
  };
}
