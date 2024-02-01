import { Canvas } from 'canvaskit-wasm';
import { DrawableObject } from '../DrawableObject';
import { Vector2 } from '../util';

export class Group extends DrawableObject {
  drawFrame: (canvas: Canvas) => void = () => {};
  isPointHit = (point: Vector2) => false;
}
