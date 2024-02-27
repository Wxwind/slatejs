import { CanvasKit } from 'canvaskit-wasm';
import { DrawableObject } from './DrawableObject';

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
