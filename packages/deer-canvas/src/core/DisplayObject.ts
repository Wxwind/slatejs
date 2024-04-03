import { IDrawable } from '../interface/IDrawable';
import { FederatedEventTarget, IFederatedEventTarget } from '../events/FederatedEventTarget';
import { Vector2 } from '../util/math';
import { BaseStyleProps, DisplayObjectConfig, ICanvas } from '../interface';
import { Transform } from './components/Transform';
import { Renderable, Sortable } from './components';
import { Shape } from '@/types';
import { vec3 } from 'gl-matrix';

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

  transform = new Transform(this);

  sortable: Sortable = {
    dirty: false,
    renderOrder: 0,
    sorted: undefined,
  };
  renderable: Renderable = {
    dirty: false,
    boundsDirty: false,
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

  worldToLocal = (point: Vector2) => {
    const tmpVec3 = vec3.fromValues(point.x, point.y, 0);
    const res = vec3.transformMat4(tmpVec3, tmpVec3, this.transform.getWorldTransformInverse());
    return { x: res[0], y: res[1] };
  };

  localToWorld = (point: Vector2) => {
    const tmpVec3 = vec3.fromValues(point.x, point.y, 0);
    const res = vec3.transformMat4(tmpVec3, tmpVec3, this.transform.getWorldTransform());
    return { x: res[0], y: res[1] };
  };
}

const DEFAULT_STYLE_PROPS: BaseStyleProps = {
  zIndex: 0,
  visible: true,
};
