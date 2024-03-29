import { Vector2 } from '../util';

export interface IDrawable {
  isPointHit: (point: Vector2) => boolean;
}
