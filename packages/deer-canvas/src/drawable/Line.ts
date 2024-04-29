import { DisplayObject } from '../core/DisplayObject';
import { DeepPartial, ShapeCtor, Vector2, pointToSegment } from '../util';
import { Shape } from '@/types';
import { BaseStyleProps, DisplayObjectConfig } from '@/interface';
import { merge } from '@/util';
import { genUUID } from 'deer-engine';

const DEFAULT_LINE_CONFIG: LineStyleProps = {
  begin: { x: 0, y: 0 },
  end: { x: 2, y: 0 },
  hitBias: 0.1,
};

export interface LineStyleProps extends BaseStyleProps {
  begin: Vector2;
  end: Vector2;
  hitBias: number;
}

export class Line extends DisplayObject<LineStyleProps> {
  constructor(config: ShapeCtor<LineStyleProps>) {
    const parsedConfig = merge({}, DEFAULT_LINE_CONFIG, config.style);
    super({
      id: config.id || genUUID(''),
      name: config.name || 'Line',
      type: Shape.Line,
      style: parsedConfig,
    });
  }

  isPointHit = (point: Vector2) => {
    const localP = this.worldToLocal(point);

    const { begin, end, hitBias } = this.style;
    return pointToSegment(localP.x, localP.y, begin.x, begin.y, end.x, end.y) <= hitBias;
  };
}
