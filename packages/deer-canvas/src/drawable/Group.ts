import { DisplayObject } from '../core/DisplayObject';
import { genUUID, ShapeCtor, Vector2, merge } from '../util';
import { Shape } from '@/types';
import { BaseStyleProps } from '@/interface';

const DEFAULT_GROUP_CONFIG = {
  center: { x: 0, y: 0 },
};

export interface GroupStyleProps extends BaseStyleProps {
  center: Vector2;
  width?: number;
  height?: number;
}

export class Group extends DisplayObject {
  constructor(config: ShapeCtor<DisplayObject>) {
    const parsedConfig = merge({}, DEFAULT_GROUP_CONFIG, config.style);
    super({
      id: config.id || genUUID(''),
      name: config.name || 'Group',
      type: Shape.Group,
      style: parsedConfig,
    });
  }

  isPointHit = (point: Vector2) => {
    // FIXME should be false when point out of canvas.
    return true;
  };
}
