import { Canvas } from 'canvaskit-wasm';
import { IDrawable } from './IDrawable';
import { FederatedEventTarget, IFederatedEventTarget } from './events/FederatedEventTarget';
import { Vector2 } from './util/math';

export abstract class DrawableObject extends FederatedEventTarget implements IDrawable, IFederatedEventTarget {
  abstract drawFrame: (canvas: Canvas) => void;
  abstract isPointHit: (point: Vector2) => boolean;

  render = (canvas: Canvas) => {
    this.drawFrame(canvas);
    for (const child of this.children) {
      child.drawFrame(canvas);
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
