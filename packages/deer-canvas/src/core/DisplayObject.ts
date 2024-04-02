import { IDrawable } from '../interface/IDrawable';
import { FederatedEventTarget, IFederatedEventTarget } from '../events/FederatedEventTarget';
import { Vector2 } from '../util/math';
import { BaseStyleProps, DisplayObjectConfig, ICanvas } from '../interface';
import { Transform } from './components/Transform';
import { Renderable, Sortable } from './components';
import { Shape } from '@/types';

export abstract class DisplayObject<StyleProps extends BaseStyleProps = BaseStyleProps>
  extends FederatedEventTarget
  implements IDrawable
{
  id: string;
  name: string;
  readonly type: Shape;
  style: StyleProps;
  readonly config: DisplayObjectConfig<StyleProps>;

  visible = true;

  protected transform = new Transform();

  sortable: Sortable = {
    dirty: false,
    renderOrder: 0,
    sorted: undefined,
  };
  renderable: Renderable = {
    dirty: false,
  };

  ownerCanvas!: ICanvas;

  children: DisplayObject[] = [];

  constructor(config: DisplayObjectConfig<StyleProps>) {
    super();
    this.config = config;
    this.id = config.id || '<not assigned>';
    this.name = config.name || '<not assigned>';
    this.type = config.type || Shape.Group;
    this.style = config.style || (DEFAULT_STYLE_PROPS as StyleProps);
  }

  abstract isPointHit: (point: Vector2) => boolean;

  getWorldTransform = () => {
    return this.transform.toFloat32Array();
  };

  addChild = (drawable: DisplayObject) => {
    this.children.push(drawable);
    drawable.parent = this;
  };

  removeChild = (drawable: DisplayObject) => {
    const index = this.children.findIndex((a) => a === drawable);
    if (index === -1) {
      console.warn('drawable is not exit');
      return;
    }

    drawable.parent = undefined;
    this.children.splice(index, 1);
  };

  removeAllChildren = () => {
    for (const c of this.children) {
      c.parent = undefined;
    }
    this.children.length = 0;
  };

  /** convert point from local space to parent space */
  transformToWorld: (point: Vector2) => Vector2 = (point) => {
    return this.transform.point(point);
  };

  /** convert point from parent space to local space */
  worldToTranform: (point: Vector2) => Vector2 = (point) => {
    return this.transform.invert().point(point);
  };

  toLocal = (point: Vector2) => {
    let localP = { x: point.x, y: point.y };
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let obj: IFederatedEventTarget | undefined = this;

    const parents: DisplayObject[] = [];
    while (obj) {
      parents.push(obj as DisplayObject);
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

    const parents: DisplayObject[] = [];
    while (obj) {
      parents.push(obj as DisplayObject);
      obj = obj.parent;
    }

    for (let i = 0; i < parents.length; i++) {
      const p = parents[i];
      localP = p.transformToWorld(localP);
    }

    return localP;
  };
}

const DEFAULT_STYLE_PROPS: BaseStyleProps = {
  zIndex: 0,
  visible: true,
};
