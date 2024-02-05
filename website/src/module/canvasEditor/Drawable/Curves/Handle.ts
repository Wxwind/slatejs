import { CanvasKit } from 'canvaskit-wasm';
import { Circle, CircleOptions } from '../Circle';
import { Keyframe } from 'deer-engine';

export class Handle extends Circle {
  constructor(protected canvaskit: CanvasKit, options: CircleOptions, private keyframe: Keyframe) {
    super(canvaskit, options);

    this.addEventListener('pointerdown', this.onDragStart);
    this.addEventListener('pointerout', this.onDragEnd);
    this.addEventListener('pointerupoutside', this.onDragEnd);
  }

  onDragStart = () => {
    this.addEventListener('pointermove', this.onDragMove);
  };

  onDragMove = () => {
    this.setOptions({ center: { x: 0, y: 0 } });
  };

  onDragEnd = () => {
    this.removeEventListener('pointermove', this.onDragMove);
  };
}
