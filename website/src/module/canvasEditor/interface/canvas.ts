import { CanvasKit } from 'canvaskit-wasm';
import { DrawableObject } from '../DrawableObject';
import { Group } from '..';
import { Vector2 } from '../util';

export interface ICanvas {
  parentEl: HTMLElement;
  canvasEl: HTMLCanvasElement;
  root: Group;

  viewport2Canvas: (point: Vector2) => Vector2;
}

export interface CanvasContext {
  config: Required<CanvasConfig>;
  canvas: ICanvas;
  canvasEl: HTMLCanvasElement;
  root: Group;
}

export interface CanvasConfig {
  containerId: string;
  devicePixelRatio?: number;

  supportsCSSTransform?: boolean;
  supportsPointerEvents?: boolean;
  supportsTouchEvents?: boolean;
}

export interface ViewSizeInfo {
  width: number;
  height: number;
}

export interface ViewScaleInfo {
  scale: number;
}

export interface CanvasRenderingContext {
  canvaskit: CanvasKit;
  root: DrawableObject;
  viewSizeInfo: ViewSizeInfo;
  viewScaleInfo: ViewScaleInfo;
}
