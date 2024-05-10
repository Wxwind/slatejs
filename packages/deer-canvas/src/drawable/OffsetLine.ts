import { DisplayObject } from '../core/DisplayObject';
import { genUUID, ShapeCtor, Vector2 } from '../util';
import { Shape } from '@/types';
import { BaseStyleProps } from '@/interface';
import { merge } from '@/util';

const DEFAULT_OFFSET_LINE_CONFIG: OffsetLineStyleProps = {
  beginOffset: { x: 0, y: 0 },
  endOffset: { x: 2, y: 0 },
  origin: { x: 0, y: 0 },
  lengthFactor: 1,
  hitBias: 0.1,
};

export interface OffsetLineStyleProps extends BaseStyleProps {
  beginOffset: Vector2;
  endOffset: Vector2;
  origin: Vector2;
  lengthFactor: number;
  hitBias: number;
}

export class OffsetLine extends DisplayObject<OffsetLineStyleProps> {
  constructor(config: ShapeCtor<OffsetLineStyleProps>) {
    const parsedConfig = merge({}, DEFAULT_OFFSET_LINE_CONFIG, config.style);
    super({
      id: config.id || genUUID(''),
      name: config.name || 'OffsetLine',
      type: Shape.OffsetLine,
      style: parsedConfig,
    });
  }

  isPointHit = (point: Vector2) => {
    // const localP = this.worldToLocal(point);

    // const { begin, end, hitBias } = this.style;
    // return pointToSegment(localP.x, localP.y, begin.x, begin.y, end.x, end.y) <= hitBias;
    return false;
  };
}
