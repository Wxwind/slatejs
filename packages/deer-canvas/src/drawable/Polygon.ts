import { DisplayObject } from '../core/DisplayObject';
import { Vector2, isPointInShape } from '../util/math';
import { BaseStyleProps, DisplayObjectConfig } from '@/interface';

export interface PolygonStyleProps extends BaseStyleProps {
  points: Vector2[];
}

export class Polygon extends DisplayObject<PolygonStyleProps> {
  points: Vector2[];

  constructor(config: DisplayObjectConfig<PolygonStyleProps>) {
    super(config);
    this.points = config.style?.points || [];
  }

  _render: () => void = () => {
    const array = [];
    for (const p of this.points) {
      array.push(p.x);
      array.push(p.y);
    }
    // canvas.drawPoints(this.canvaskit.PointMode.Polygon, array, this.paint);
  };

  isPointHit: (point: Vector2) => boolean = (point) => {
    return isPointInShape(this.points, point);
  };
}
