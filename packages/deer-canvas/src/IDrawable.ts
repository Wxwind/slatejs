import { Canvas } from 'canvaskit-wasm';
import { Vector2 } from './util';

export interface IDrawable {
  isPointHit: (point: Vector2) => boolean;
  render: (canvas: Canvas) => void;
}
