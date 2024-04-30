import { DisplayObject } from '../core/DisplayObject';
import { ShapeCtor, Vector2, distance, merge, genUUID } from '../util';
import { BaseStyleProps } from '../interface';
import { Shape } from '@/types';

const DEFAULT_CIRCLE_CONFIG: CircleStyleProps = {
  center: { x: 0, y: 0 },
  radius: 5,
  hitBias: 0.1,
};

export interface CircleStyleProps extends BaseStyleProps {
  center: Vector2;
  radius: number;
  hitBias: number;
}

export class Circle extends DisplayObject<CircleStyleProps> {
  type = Shape.Circle;

  constructor(config: ShapeCtor<CircleStyleProps>) {
    const parsedConfig = merge({}, DEFAULT_CIRCLE_CONFIG, config.style);
    super({
      id: config.id || genUUID(''),
      name: config.name || 'Circle',
      type: Shape.Circle,
      style: parsedConfig,
    });
  }

  isPointHit: (point: Vector2) => boolean = (point) => {
    const localP = this.worldToLocal(point);
    const { center, radius, hitBias } = this.style;
    return distance(localP, center) <= radius + hitBias;
  };
}
