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
import { Line, LineStyleProps } from '../Line';
import { BaseStyleProps } from '@/interface';
import { Signal } from '@/packages/signal';
import { ControlCircle } from '../ContorlCircle';
import { ControlHandle } from './ControlHandle';
import { CameraEvent } from '@/camera';

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
  lineWidth: 20,
};

const EPSILON = 10e-4;
const LENGTH_FACTOR = 15;

export interface CurveStyleProps extends BaseStyleProps {
  disable?: boolean;
  lineStyle: Partial<LineStyleProps>;
  handleStyle: Partial<CircleStyleProps>;
  keyStyle: Partial<CircleStyleProps>;
}

export class Curve extends DisplayObject<CurveStyleProps> {
  type = Shape.Curve;
  curve: AnimationCurve | undefined;

  signals = {
    onDragEnd: new Signal<[AnimationCurveJson | undefined]>(),
  };

  constructor(config: ShapeCtor<CurveStyleProps>) {
    const parsedConfig = merge({}, DEFAULT_CURVE_CONFIG, config.style);
    console.log('parsed curve config', parsedConfig);

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
    const camera = this.ownerCanvas.getCamera();
    const canvas = this.ownerCanvas;

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
    keyCircle.sortable.renderOrder = 10; // 确保位于handle上方
    const keyHandle = new Handle(keyCircle, {
      onContextMenu: (e) => {
        keyCircle.ownerCanvas.eventEmitter.emit('DisplayObjectContextMenu', e, key, ContextMenuType.Handle);
      },
    });
    keyHandle.signals.onDrag.on((pos) => {
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
        const angle = Math.atan((inTangent / camera.Zoom[1]) * camera.Zoom[0]);
        const cx = -Math.cos(angle) * inWeight;
        const cy = -Math.sin(angle) * inWeight;

        const inLine = this.ownerCanvas.createElement(Line, {
          name: 'in line',
          style: {
            ...lineStyle,
            origin: { x: time, y: value },
            beginOffset: {
              x: cx * LENGTH_FACTOR,
              y: cy * LENGTH_FACTOR,
            },
            endOffset: { x: 0, y: 0 },
            lengthFactor: LENGTH_FACTOR,
          },
        });

        const inControlCircle = this.ownerCanvas.createElement(ControlCircle, {
          name: 'in handle',
          style: {
            ...handleStyle,
            centerOffset: {
              x: cx * LENGTH_FACTOR,
              y: cy * LENGTH_FACTOR,
            },
            origin: { x: time, y: value },
          },
        });

        keyHandle.signals.onDrag.on((pos) => {
          inLine.setOptions({ origin: { x: pos.x, y: pos.y } });
          inControlCircle.setOptions({ origin: { x: pos.x, y: pos.y } });
        });
        keyHandle.signals.onDragEnd.on(() => {
          this.signals.onDragEnd.emit(this.curve?.toJSON());
        });

        this.addChild(inLine);
        this.addChild(inControlCircle);

        const inHandle = new ControlHandle(inControlCircle);
        inHandle.signals.onDrag.on((pos) => {
          const index = curve.keys.findIndex((a) => a === key);
          const real = canvas.canvas2Viewport({ x: key.time, y: key.value });
          if (pos.x >= real.x) pos.x = real.x - EPSILON;
          // tangent is modified by camera's zoom
          const deltaY = pos.y - real.y;
          const deltaX = pos.x - real.x;
          const cameraScale = camera.Zoom[1] / camera.Zoom[0];
          key.inTangent = -deltaY / deltaX / cameraScale;
          key.inWeight = length(deltaX / LENGTH_FACTOR, deltaY / LENGTH_FACTOR);

          curve.moveKey(index, key);
          inHandle.setOptions({ centerOffset: { x: deltaX, y: deltaY } });
          inLine.setOptions({ beginOffset: { x: deltaX, y: deltaY } });
        });
        inHandle.signals.onDragEnd.on(() => {
          this.signals.onDragEnd.emit(this.curve?.toJSON());
        });

        camera.eventEmitter.on(CameraEvent.ZOOMED, () => {
          const inTangent = key.inTangent;
          const inWeight = key.inWeight;
          const angle = Math.atan((inTangent * camera.Zoom[1]) / camera.Zoom[0]);
          const cx = -Math.cos(angle) * inWeight;
          const cy = -Math.sin(angle) * inWeight;
          const real = { x: cx * LENGTH_FACTOR, y: -cy * LENGTH_FACTOR };

          inHandle.setOptions({ centerOffset: { x: real.x, y: real.y } });
          inLine.setOptions({ beginOffset: { x: real.x, y: real.y } });
        });
      }

      // draw right control
      if (isOutWeightEnabled(key) && index !== curve.length - 1) {
        const angle = Math.atan(outTangent);
        const cx = Math.cos(angle) * outWeight;
        const cy = Math.sin(angle) * outWeight;

        const outLine = this.ownerCanvas.createElement(Line, {
          name: 'out line',
          style: {
            ...lineStyle,
            origin: { x: time, y: value },
            beginOffset: {
              x: cx * LENGTH_FACTOR,
              y: cy * LENGTH_FACTOR,
            },
            endOffset: { x: 0, y: 0 },
            lengthFactor: LENGTH_FACTOR,
          },
        });

        const outControlCircle = this.ownerCanvas.createElement(ControlCircle, {
          name: 'out handle',
          style: {
            ...handleStyle,
            centerOffset: {
              x: cx * LENGTH_FACTOR,
              y: cy * LENGTH_FACTOR,
            },
            origin: { x: time, y: value },
          },
        });

        keyHandle.signals.onDrag.on((pos) => {
          outLine.setOptions({ origin: { x: pos.x, y: pos.y } });
          outControlCircle.setOptions({ origin: { x: pos.x, y: pos.y } });
        });
        keyHandle.signals.onDragEnd.on(() => {
          this.signals.onDragEnd.emit(this.curve?.toJSON());
        });

        this.addChild(outLine);
        this.addChild(outControlCircle);

        const outHandle = new ControlHandle(outControlCircle);
        outHandle.signals.onDrag.on((pos) => {
          const index = curve.keys.findIndex((a) => a === key);
          const real = canvas.canvas2Viewport({ x: key.time, y: key.value });
          if (pos.x <= real.x) pos.x = real.x - EPSILON;
          // tangent is modified by camera's zoom
          const deltaY = pos.y - real.y;
          const deltaX = pos.x - real.x;
          const cameraScale = camera.Zoom[1] / camera.Zoom[0];
          key.outTangent = -deltaY / deltaX / cameraScale;
          key.outWeight = length(deltaX / LENGTH_FACTOR, deltaY / LENGTH_FACTOR);

          curve.moveKey(index, key);
          outHandle.setOptions({ centerOffset: { x: deltaX, y: deltaY } });
          outLine.setOptions({ beginOffset: { x: deltaX, y: deltaY } });
        });
        outHandle.signals.onDragEnd.on(() => {
          this.signals.onDragEnd.emit(this.curve?.toJSON());
        });
        camera.eventEmitter.on(CameraEvent.ZOOMED, () => {
          const outTangent = key.outTangent;
          const outWeight = key.outWeight;
          const angle = Math.atan((outTangent * camera.Zoom[1]) / camera.Zoom[0]);
          const cx = Math.cos(angle) * outWeight;
          const cy = Math.sin(angle) * outWeight;
          const real = { x: cx * LENGTH_FACTOR, y: -cy * LENGTH_FACTOR };

          outHandle.setOptions({ centerOffset: { x: real.x, y: real.y } });
          outLine.setOptions({ beginOffset: { x: real.x, y: real.y } });
        });
      }
    }
  };

  isPointHit: (point: Vector2) => boolean = () => false;
}
