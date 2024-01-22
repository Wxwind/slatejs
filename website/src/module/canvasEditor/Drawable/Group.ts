import { Canvas } from 'canvaskit-wasm';
import { DrawableObject } from '../DrawableObject';
import { Vector2 } from '../types';

export class Group extends DrawableObject {
  children: DrawableObject[] = [];

  draw = (canvas: Canvas) => {
    for (const child of this.children) {
      child.draw(canvas);
    }
  };

  isPointIn = (point: Vector2) => false;

  addChildren = (child: DrawableObject) => {
    this.children.push(child);
  };

  removeChildren = (child: DrawableObject) => {
    const index = this.children.findIndex((a) => a === child);
    if (index === -1) return;
    this, this.children.splice(index, 1);
  };
}
