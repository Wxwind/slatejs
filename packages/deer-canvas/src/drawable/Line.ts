import { DisplayObject } from '../core/DisplayObject';
import { Vector2, pointToSegment } from '../util';
import { Shape } from '@/types';
import { BaseStyleProps, DisplayObjectConfig } from '@/interface';

export interface LineStyleProps extends BaseStyleProps {
  begin: Vector2;
  end: Vector2;
  hitBias: number;
}

export class Line extends DisplayObject<LineStyleProps> {
  begin: Vector2;
  end: Vector2;
  hitBias: number;

  constructor(config: DisplayObjectConfig<LineStyleProps>) {
    super({
      type: Shape.Line,
      ...config,
    });

    this.begin = config.style?.begin || { x: 0, y: 0 };
    this.end = config.style?.end || { x: 2, y: 0 };
    this.hitBias = config.style?.hitBias || 0.1;
  }

  isPointHit = (point: Vector2) => {
    const localP = this.worldToLocal(point);

    return pointToSegment(localP.x, localP.y, this.begin.x, this.begin.y, this.end.x, this.end.y) <= this.hitBias;
  };
}
