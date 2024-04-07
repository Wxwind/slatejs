import { AnimationCurve, Keyframe, Signal } from 'deer-engine';
import { DisplayObject } from '../../core/DisplayObject';
import { Vector2, isNil } from '../../util';
import { Handle } from './Handle';
import { DisplayObjectConfig } from '../../interface';
import { Shape } from '@/types';
import { Circle } from '../Circle';

export class Curve extends DisplayObject {
  type = Shape.Curve;
  curve: AnimationCurve | undefined;

  signals = {
    curvesChanged: new Signal(),
  };

  constructor(config: DisplayObjectConfig) {
    super(config);
  }

  setCurve = (curve: AnimationCurve | undefined) => {
    this.curve = curve;
    this.removeAllChildren();
    if (isNil(curve)) return;
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
