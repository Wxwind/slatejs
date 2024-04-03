import { DisplayObject } from '../core/DisplayObject';
import { Vector2, distance2 } from '../util';
import { BaseStyleProps, DisplayObjectConfig } from '../interface';
import { Shape } from '@/types';

export interface CircleStyleProps extends BaseStyleProps {
  center: Vector2;
  radius: number;
}

export class Circle extends DisplayObject<CircleStyleProps> {
  type = Shape.Circle;

  center: Vector2 = { x: 0, y: 0 };
  radius = 1;

  constructor(config: DisplayObjectConfig<CircleStyleProps>) {
    super({
      type: Shape.Circle,
      ...config,
    });

    this.center = config.style?.center || { x: 0, y: 0 };
    this.radius = config.style?.radius || 5;
  }

  setOptions(options: Partial<CircleStyleProps>) {
    this.center = options.center ?? this.center;
    this.radius = options.radius ?? this.radius;
  }

  isPointHit: (point: Vector2) => boolean = (point) => {
    const localP = this.worldToLocal(point);
    return distance2(localP, this.center) <= this.radius * this.radius;
  };
}
