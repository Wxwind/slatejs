import { AnimationCurve, Keyframe, Signal } from 'deer-engine';
import { DisplayObject } from '../../core/DisplayObject';
import { Vector2 } from '../../util';
import { Handle } from './Handle';
import { BaseStyleProps, DisplayObjectConfig } from '../../interface';
import { Shape } from '@/types';
import { Circle } from '../Circle';

export interface CurveProps extends BaseStyleProps {
  curve: AnimationCurve;
}

export class Curve extends DisplayObject<CurveProps> {
  type = Shape.Curve;
  curve: AnimationCurve | undefined;

  signals = {
    curvesChanged: new Signal(),
  };

  constructor(config: DisplayObjectConfig<CurveProps>) {
    super(config);

    this.curve = config.style?.curve;
  }

  setCurve = (curve: AnimationCurve) => {
    this.curve = curve;
    this.removeAllChildren();
    for (let j = 0; j < curve.keys.length; j += 1) {
      this.createHandle(curve, curve.keys[j]);
    }
  };

  private createHandle = (curve: AnimationCurve, key: Keyframe) => {
    const circle = this.ownerCanvas.createElement(Circle, {
      name: 'handle',
      style: {
        center: {
          x: key.time,
          y: key.value,
        },
        radius: 0.2,
      },
    });
    const handle = new Handle(circle);
    this.addChild(circle);

    handle.setDragMoveHandler((pos) => {
      const index = curve.keys.findIndex((a) => a === key);
      key.time = pos.x;
      key.value = pos.y;
      curve.moveKey(index, key);
      handle.setOptions({ center: pos });
      this.signals.curvesChanged.emit();
    });

    return handle;
  };

  isPointHit: (point: Vector2) => boolean = () => false;
}
