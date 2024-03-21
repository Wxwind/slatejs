import { Canvas } from 'canvaskit-wasm';
import { DisplayObject } from '../core/DisplayObject';
import { Vector2 } from '../util';

export class Group extends DisplayObject {
  _render: (canvas: Canvas) => void = () => {
    return;
  };

  isPointHit = (point: Vector2) => {
    // FIXME should be false when point out of canvas.
    return true;
  };
}
