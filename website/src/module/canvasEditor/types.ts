import { Group } from './Drawable/Group';
import { Vector2 } from './util';

export interface ICanvas {
  parentEl: HTMLElement;
  canvasEl: HTMLCanvasElement;
  root: Group;
  devicePixelRatio: number;
  supportsTouchEvents: boolean;
  supportsPointerEvents: boolean;

  viewport2Canvas: (point: Vector2) => Vector2;
}

export interface CanvasConfig {
  containerId: string;
  devicePixelRatio?: number;

  supportsCSSTransform?: boolean;
  supportsPointerEvents?: boolean;
  supportsTouchEvents?: boolean;
}

export interface CanvasContext {
  config: Required<CanvasConfig>;
  canvas: ICanvas;
}
