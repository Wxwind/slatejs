import { Canvas } from 'canvaskit-wasm';
import { IDrawable } from './IDrawable';
import { FederatedEventTarget, IFederatedEventTarget } from './events/FederatedEventTarget';
import { Transform, Vector2 } from './util/math';

export abstract class DrawableObject extends FederatedEventTarget implements IDrawable {
  abstract _render: (canvas: Canvas) => void;
  abstract isPointHit: (point: Vector2) => boolean;

  visible = true;
  protected transform = new Transform();

  render = (canvas: Canvas) => {
    if (!this.visible) return;

    canvas.save();

    canvas.concat(this.transform.toFloat32Array());
    this._render(canvas);
    for (const child of this.children) {
      child.render(canvas);
    }

    canvas.restore();
  };

  children: DrawableObject[] = [];

  addChild = (drawable: DrawableObject) => {
    this.children.push(drawable);
    drawable.parent = this;
  };

  removeChild = (drawable: DrawableObject) => {
    const index = this.children.findIndex((a) => a === drawable);
    if (index === -1) {
      console.warn('drawable is not exit');
      return;
    }

    drawable.parent = undefined;
    this.children.splice(index, 1);
  };

  // convert point from local space to parent space
  transformToWorld: (point: Vector2) => Vector2 = (point) => {
    return this.transform.point(point);
  };

  // convert point from parent space to local space
  worldToTranform: (point: Vector2) => Vector2 = (point) => {
    return this.transform.invert().point(point);
  };

  toLocal = (point: Vector2) => {
    let localP = point;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let obj: IFederatedEventTarget | undefined = this;

    const parents: DrawableObject[] = [];
    while (obj) {
      parents.push(obj as DrawableObject);
      obj = obj.parent;
    }

    for (let i = parents.length - 1; i >= 0; i--) {
      const p = parents[i];
      localP = p.worldToTranform(localP);
    }

    return localP;
  };

  toWorld = (point: Vector2) => {
    let localP = point;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let obj: IFederatedEventTarget | undefined = this;

    const parents: DrawableObject[] = [];
    while (obj) {
      parents.push(obj as DrawableObject);
      obj = obj.parent;
    }

    for (let i = 0; i < parents.length; i++) {
      const p = parents[i];
      localP = p.transformToWorld(localP);
    }

    return localP;
  };
}
