import { Canvas } from 'canvaskit-wasm';
import { DrawableObject } from '../DrawableObject';
import { Vector2 } from '../util';

export class Group extends DrawableObject {
  _render: (canvas: Canvas) => void = () => {
    return;
  };
  isPointHit = (point: Vector2) => false;
}
