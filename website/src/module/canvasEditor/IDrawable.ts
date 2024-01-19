import { Canvas } from 'canvaskit-wasm';
import { Vector2 } from './types';

export interface IDrawable {
  draw: (canvas: Canvas) => void;
  isPointIn: (point: Vector2) => boolean;
}
