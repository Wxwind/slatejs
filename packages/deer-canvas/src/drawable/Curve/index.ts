import {
  AnimationCurve,
  AnimationCurveJson,
  InterpMode,
  Keyframe,
  TangentMode,
  isInWeightEnabled,
  isOutWeightEnabled,
} from 'deer-engine';
import { DisplayObject } from '@/core/DisplayObject';
import { ShapeCtor, Vector2, isNil, length, merge, genUUID } from '@/util';
import { Handle } from './Handle';
import { ContextMenuType, Shape } from '@/types';
import { Circle, CircleStyleProps } from '../Circle';
import { OffsetLineStyleProps } from '../OffsetLine';
import { BaseStyleProps } from '@/interface';
import { Signal } from '@/packages/signal';
import { Line } from '../Line';

const DEFAULT_CURVE_CONFIG: CurveStyleProps = {
  disable: false,
  lineStyle: {
    hitBias: 2,
    lineWidth: 2,
    strokeStyle: '#757881',
  },
  handleStyle: {
    fillStyle: '#7262fd',
    radius: 3,
    hitBias: 2,
  },
  keyStyle: {
    fillStyle: '#ffffff',
    radius: 3,
    hitBias: 2,
  },
  lineWidth: 1,
};

const EPSILON = 10e-4;

export interface CurveStyleProps extends BaseStyleProps {
  disable?: boolean;
  lineStyle: Partial<OffsetLineStyleProps>;
  handleStyle: Partial<CircleStyleProps>;
  keyStyle: Partial<CircleStyleProps>;
  minX?: number;
  maxX?: number;
}

export class Curve extends DisplayObject<CurveStyleProps> {
  type = Shape.Curve;
  curve: AnimationCurve | undefined;

  signals = {
    onDragEnd: new Signal<[AnimationCurveJson | undefined]>(),
  };

  constructor(config: ShapeCtor<CurveStyleProps>) {
    const parsedConfig = merge({}, DEFAULT_CURVE_CONFIG, config.style);

    super({
      id: config.id || genUUID(''),
      name: config.name || 'Line',
      type: Shape.Curve,
      style: parsedConfig,
    });
  }

  setCurve = (curve: AnimationCurve | undefined) => {
    this.curve = curve;
    this.removeAllChildren();
    if (isNil(curve)) return;
    for (let j = 0; j < curve.keys.length; j += 1) {
      const key = curve.keys[j];
      !this.style.disable && this.createHandle(curve, key);
    }
  };

  private isControlEnabled = (tangentMode: TangentMode, interpMode: InterpMode) => {
    return interpMode === InterpMode.Cubic && (tangentMode === TangentMode.User || tangentMode === TangentMode.Break);
  };

  private createHandle = (curve: AnimationCurve, key: Keyframe) => {
    const lineStyle = this.style.lineStyle;
    const handleStyle = this.style.handleStyle;
    const keyStyle = this.style.keyStyle;

    // draw key handle
    const keyCircle = this.ownerCanvas.createElement(Circle, {
      name: 'handle',
      style: {
        ...keyStyle,
        center: {
          x: key.time,
          y: key.value,
        },
      },
    });
    keyCircle.sortable.renderOrder = 10; // display above the handle
    const keyHandle = new Handle(keyCircle, {
      onContextMenu: (e) => {
        keyCircle.ownerCanvas.eventEmitter.emit('DisplayObjectContextMenu', e, key, ContextMenuType.Handle);
      },
    });
    keyHandle.signals.onDrag.on((pos) => {
      pos = this.clampPos(pos);
      const index = curve.keys.findIndex((a) => a === key);
      key.time = pos.x;
      key.value = pos.y;
      curve.moveKey(index, key);
      keyHandle.setOptions({ center: pos });
    });
    keyHandle.signals.onDragEnd.on(() => {
      this.signals.onDragEnd.emit(this.curve?.toJSON());
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
            ...lineStyle,
            begin: {
              x: cx,
              y: cy,
            },
            end: { x: time, y: value },
          },
        });

        const inControlCircle = this.ownerCanvas.createElement(Circle, {
          name: 'in handle',
          style: {
            ...handleStyle,
            center: {
              x: cx,
              y: cy,
            },
          },
        });

        keyHandle.signals.onDrag.on((pos) => {
          pos = this.clampPos(pos);
          const angle = Math.atan(key.inTangent);
          const x = pos.x - Math.cos(angle) * key.inWeight;
          const y = pos.y - Math.sin(angle) * key.inWeight;
          inLine.setOptions({ begin: { x, y }, end: pos });
          inControlCircle.setOptions({ center: { x, y } });
        });
        keyHandle.signals.onDragEnd.on(() => {
          this.signals.onDragEnd.emit(this.curve?.toJSON());
        });

        this.addChild(inLine);
        this.addChild(inControlCircle);

        const inHandle = new Handle(inControlCircle);
        inHandle.signals.onDrag.on((pos) => {
          const index = curve.keys.findIndex((a) => a === key);
          if (pos.x >= key.time) pos.x = key.time - EPSILON;
          key.inTangent = (pos.y - key.value) / (pos.x - key.time);
          key.inWeight = length(pos.x - key.time, pos.y - key.value);
          curve.moveKey(index, key);
          inHandle.setOptions({ center: pos });
          inLine.setOptions({ begin: pos });
        });
        inHandle.signals.onDragEnd.on(() => {
          this.signals.onDragEnd.emit(this.curve?.toJSON());
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
            ...lineStyle,
            begin: {
              x: cx,
              y: cy,
            },
            end: { x: time, y: value },
          },
        });

        const outControlCircle = this.ownerCanvas.createElement(Circle, {
          name: 'out handle',
          style: {
            ...handleStyle,
            center: {
              x: cx,
              y: cy,
            },
          },
        });

        keyHandle.signals.onDrag.on((pos) => {
          pos = this.clampPos(pos);
          const angle = Math.atan(key.outTangent);
          const x = pos.x + Math.cos(angle) * key.outWeight;
          const y = pos.y + Math.sin(angle) * key.outWeight;
          outLine.setOptions({ begin: { x, y }, end: pos });
          outControlCircle.setOptions({ center: { x, y } });
        });
        keyHandle.signals.onDragEnd.on(() => {
          this.signals.onDragEnd.emit(this.curve?.toJSON());
        });

        this.addChild(outLine);
        this.addChild(outControlCircle);

        const outHandle = new Handle(outControlCircle);
        outHandle.signals.onDrag.on((pos) => {
          const index = curve.keys.findIndex((a) => a === key);
          if (pos.x <= key.time) pos.x = key.time + EPSILON;
          key.outTangent = (pos.y - key.value) / (pos.x - key.time);
          key.outWeight = length(pos.x - key.time, pos.y - key.value);
          curve.moveKey(index, key);
          outHandle.setOptions({ center: pos });
          outLine.setOptions({ begin: pos });
        });
        outHandle.signals.onDragEnd.on(() => {
          this.signals.onDragEnd.emit(this.curve?.toJSON());
        });
      }
    }
  };

  private clampPos = (pos: Vector2) => {
    let x = !isNil(this.style.minX) ? Math.max(this.style.minX, pos.x + EPSILON) : pos.x;
    x = !isNil(this.style.maxX) ? Math.min(this.style.maxX - EPSILON, x) : x;
    return { x, y: pos.y };
  };

  isPointHit: (point: Vector2) => boolean = () => false;
}
