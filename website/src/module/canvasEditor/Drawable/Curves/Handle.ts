import { CanvasKit } from 'canvaskit-wasm';
import { Circle, CircleOptions } from '../Circle';
import { Keyframe } from 'deer-engine';

export class Handle extends Circle {
  constructor(protected canvaskit: CanvasKit, options: CircleOptions, private keyframe: Keyframe) {
    super(canvaskit, options);

    this.on('pointerdown', this.onDragStart);
    this.on('pointerout', this.onDragEnd);
    this.on('pointerupoutside', this.onDragEnd);
  }

  onDragStart = () => {
    this.on('pointermove', this.onDragMove);
  };

  onDragMove = () => {
    this.setOptions({ center: { x: 0, y: 0 } });
  };

  onDragEnd = () => {
    this.off('pointermove', this.onDragMove);
  };
}
