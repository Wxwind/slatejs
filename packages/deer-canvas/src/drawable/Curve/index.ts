import {
  AnimationCurve,
  InterpMode,
  Keyframe,
  Signal,
  TangentMode,
  isInWeightEnabled,
  isOutWeightEnabled,
} from 'deer-engine';
import { DisplayObject } from '../../core/DisplayObject';
import { Vector2, isNil, length } from '../../util';
import { Handle } from './Handle';
import { DisplayObjectConfig } from '../../interface';
import { ContextMenuType, Shape } from '@/types';
import { Circle } from '../Circle';
import { Line } from '../Line';

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
      const key = curve.keys[j];
      this.createHandle(curve, key);
    }
  };

  private isControlEnabled = (tangentMode: TangentMode, interpMode: InterpMode) => {
    return interpMode === InterpMode.Cubic && (tangentMode === TangentMode.User || tangentMode === TangentMode.Break);
  };

  private createHandle = (curve: AnimationCurve, key: Keyframe) => {
    // draw key handle
    const keyCircle = this.ownerCanvas.createElement(Circle, {
      name: 'handle',
      style: {
        center: {
          x: key.time,
          y: key.value,
        },
        radius: 0.1,
      },
    });
    const keyHandle = new Handle(keyCircle, {
      onContextMenu: (e) => {
        keyCircle.ownerCanvas.eventEmitter.emit('DisplayObjectContextMenu', e, key, ContextMenuType.Handle);
      },
    });
    keyHandle.onDrag.on((pos) => {
      const index = curve.keys.findIndex((a) => a === key);
      key.time = pos.x;
      key.value = pos.y;
      curve.moveKey(index, key);
      keyHandle.setOptions({ center: pos });
      this.signals.curvesChanged.emit();
    });
    this.addChild(keyCircle);

    if (this.isControlEnabled(key.tangentMode, key.interpMode)) {
      const { time, value, inTangent, outTangent, inWeight, outWeight, tangentMode } = key;

      const index = curve.keys.findIndex((a) => a === key);
      // draw left control
      if (isInWeightEnabled(key) && index !== 0) {
        const angle = Math.atan(inTangent);
        const cx = time - Math.cos(angle) * inWeight;
        const cy = value - Math.sin(angle) * inWeight;

        const inLine = this.ownerCanvas.createElement(Line, {
          name: 'in line',
          style: {
            begin: {
              x: cx,
              y: cy,
            },
            end: { x: time, y: value },
            hitBias: 0.1,
            lineWidth: 0.05,
          },
        });

        const circle = this.ownerCanvas.createElement(Circle, {
          name: 'in handle',
          style: {
            center: {
              x: cx,
              y: cy,
            },
            radius: 0.1,
          },
        });

        keyHandle.onDrag.on((pos) => {
          const angle = Math.atan(key.inTangent);
          const x = pos.x - Math.cos(angle) * key.inWeight;
          const y = pos.y - Math.sin(angle) * key.inWeight;
          inLine.setOptions({ begin: { x, y }, end: pos });
          circle.setOptions({ center: { x, y } });
        });

        this.addChild(inLine);
        this.addChild(circle);

        const inHandle = new Handle(circle);
        inHandle.onDrag.on((pos) => {
          const index = curve.keys.findIndex((a) => a === key);
          key.inTangent = (pos.y - key.value) / (pos.x - key.time);
          key.inWeight = length(pos.x - key.time, pos.y - key.value);
          curve.moveKey(index, key);
          inHandle.setOptions({ center: pos });
          inLine.setOptions({ begin: pos });
          this.signals.curvesChanged.emit();
        });
      }

      // draw right control
      if (isOutWeightEnabled(key) && index !== curve.length - 1) {
        const angle = Math.atan(outTangent);
        const cx = time + Math.cos(angle) * outWeight;
        const cy = value + Math.sin(angle) * outWeight;

        const outLine = this.ownerCanvas.createElement(Line, {
          name: 'out line',
          style: {
            begin: {
              x: cx,
              y: cy,
            },
            end: { x: time, y: value },
            hitBias: 0.1,
            lineWidth: 0.05,
          },
        });

        const circle = this.ownerCanvas.createElement(Circle, {
          name: 'out handle',
          style: {
            center: {
              x: cx,
              y: cy,
            },
            radius: 0.1,
          },
        });

        keyHandle.onDrag.on((pos) => {
          const angle = Math.atan(key.inTangent);
          const x = pos.x + Math.cos(angle) * key.outWeight;
          const y = pos.y + Math.sin(angle) * key.outTangent;
          outLine.setOptions({ begin: { x, y }, end: pos });
          circle.setOptions({ center: { x, y } });
        });

        this.addChild(outLine);
        this.addChild(circle);

        const outHandle = new Handle(circle);
        outHandle.onDrag.on((pos) => {
          const index = curve.keys.findIndex((a) => a === key);
          key.outTangent = (pos.y - key.value) / (pos.x - key.time);
          key.outWeight = length(pos.x - key.time, pos.y - key.value);
          curve.moveKey(index, key);
          outHandle.setOptions({ center: pos });
          outLine.setOptions({ begin: pos });
          this.signals.curvesChanged.emit();
        });
      }
    }
  };

  isPointHit: (point: Vector2) => boolean = () => false;
}
