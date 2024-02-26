import { CanvasKit } from 'canvaskit-wasm';
import { Circle, CircleOptions } from '../Circle';
import { FederatedPointerEvent } from '../../events';

export class Handle extends Circle {
  private onDragMoveCallBack: ((e: FederatedPointerEvent) => void) | undefined = undefined;

  constructor(
    protected canvaskit: CanvasKit,
    options: CircleOptions
  ) {
    super(canvaskit, options);

    this.addEventListener('pointerdown', this.onDragStart);
    this.addEventListener('pointerup', this.onDragEnd);
    this.addEventListener('pointerupoutside', this.onDragEnd);
  }

  setDragMoveHandler = (fn: (e: FederatedPointerEvent) => void) => {
    this.onDragMoveCallBack = fn;
  };

  onDragStart = () => {
    console.log('drag start');
    this.parent?.addEventListener('pointermove', this.onDragMove);
  };

  onDragMove = (e: FederatedPointerEvent) => {
    this.setOptions({ center: { x: e.globalX, y: e.globalY } });
    this.onDragMoveCallBack?.(e);
  };

  onDragEnd = (e: FederatedPointerEvent) => {
    console.log('drag end', e.type);
    this.parent?.removeEventListener('pointermove', this.onDragMove);
  };
}
