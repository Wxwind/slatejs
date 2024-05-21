import { DisplayObject } from '../core/DisplayObject';
import { ShapeCtor, Vector2, distance, merge, genUUID } from '../util';
import { BaseStyleProps } from '../interface';
import { Shape } from '@/types';

const DEFAULT_CIRCLE_CONFIG: ControlCircleStyleProps = {
  centerOffset: { x: 0, y: 0 },
  origin: { x: 0, y: 0 },
  radius: 5,
  hitBias: 0.1,
};

export interface ControlCircleStyleProps extends BaseStyleProps {
  centerOffset: Vector2;
  origin: Vector2;
  radius: number;
  hitBias: number;
}

export class ControlCircle extends DisplayObject<ControlCircleStyleProps> {
  constructor(config: ShapeCtor<ControlCircleStyleProps>) {
    const parsedConfig = merge({}, DEFAULT_CIRCLE_CONFIG, config.style);
    super({
      id: config.id || genUUID(''),
      name: config.name || 'Control_Circle',
      type: Shape.ControlCircle,
      style: parsedConfig,
    });
  }

  isPointHit: (point: Vector2) => boolean = (point) => {
    const { centerOffset, radius, hitBias, origin } = this.style;
    const realOrigin = this.ownerCanvas.canvas2Viewport(origin);
    const realCenter = { x: realOrigin.x + centerOffset.x, y: realOrigin.y + centerOffset.y };
    return distance(point, realCenter) <= radius + hitBias;
  };
}
