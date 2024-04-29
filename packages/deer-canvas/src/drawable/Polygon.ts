import { ShapeCtor, merge } from '@/util';
import { DisplayObject } from '../core/DisplayObject';
import { Vector2, isPointInShape } from '../util/math';
import { BaseStyleProps } from '@/interface';
import { genUUID } from 'deer-engine';
import { Shape } from '..';

const DEFAULT_POLYGON_CONFIG: PolygonStyleProps = {
  points: [],
};

export interface PolygonStyleProps extends BaseStyleProps {
  points: Vector2[];
}

export class Polygon extends DisplayObject<PolygonStyleProps> {
  constructor(config: ShapeCtor<PolygonStyleProps>) {
    const parsedConfig = merge({}, DEFAULT_POLYGON_CONFIG, config.style);
    super({
      id: config.id || genUUID(''),
      name: config.name || 'Polygon',
      type: Shape.Polygon,
      style: parsedConfig,
    });
  }

  isPointHit: (point: Vector2) => boolean = (point) => {
    return isPointInShape(this.style.points, point);
  };
}
