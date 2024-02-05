import { Canvas } from 'canvaskit-wasm';
import { IDrawable } from './IDrawable';
import { FederatedEventTarget } from './events/FederatedEventTarget';
import { Transform, Vector2 } from './util/math';

export abstract class DrawableObject extends FederatedEventTarget implements IDrawable {
  abstract _render: (canvas: Canvas) => void;
  abstract isPointHit: (point: Vector2) => boolean;

  protected transform = new Transform();

  render = (canvas: Canvas) => {
    this._render(canvas);
    for (const child of this.children) {
      child._render(canvas);
    }
  };

  children: DrawableObject[] = [];

  addChild = (drawable: DrawableObject) => {
    this.children.push(drawable);
  };

  removeChild = (drawable: DrawableObject) => {
    const index = this.children.findIndex((a) => a === drawable);
    if (index === -1) {
      console.warn('drawable is not exit');
      return;
    }

    this.children.splice(index, 1);
  };
}
