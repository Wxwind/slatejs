import { DisplayObject } from '../core/DisplayObject';
import { Vector2 } from '../util';
import { Shape } from '@/types';
import { BaseStyleProps, DisplayObjectConfig } from '@/interface';

export interface GroupStyleProps extends BaseStyleProps {
  center: Vector2;
  width?: number;
  height?: number;
}

export class Group extends DisplayObject {
  constructor(config: DisplayObjectConfig<GroupStyleProps>) {
    super({
      type: Shape.Group,
      ...config,
    });
  }

  isPointHit = (point: Vector2) => {
    // FIXME should be false when point out of canvas.
    return true;
  };
}
