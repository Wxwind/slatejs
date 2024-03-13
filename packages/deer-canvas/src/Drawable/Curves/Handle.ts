import { Circle } from '../Circle';
import { FederatedPointerEvent } from '../../events';
import { Vector2 } from '../../util';
import { CanvasContext } from '../../interface';

export class Handle extends Circle {
  private onDragMoveCallBack: ((localPos: Vector2) => void) | undefined = undefined;

  constructor(context: CanvasContext) {
    super(context);

    this.addEventListener('pointerdown', this.onDragStart);
    this.addEventListener('pointerup', this.onDragEnd);
    this.addEventListener('pointerupoutside', this.onDragEnd);

    this.cursor = 'pointer';
  }

  setDragMoveHandler = (fn: (localPos: Vector2) => void) => {
    this.onDragMoveCallBack = fn;
  };

  onDragStart = () => {
    this.context.renderingContext.root?.addEventListener('pointermove', this.onDragMove);
  };

  onDragMove = (e: FederatedPointerEvent) => {
    const localP = this.toLocal({ x: e.globalX, y: e.globalY });
    this.onDragMoveCallBack?.(localP);
  };

  onDragEnd = (e: FederatedPointerEvent) => {
    console.log('drag end', e.type);
    this.context.renderingContext.root?.removeEventListener('pointermove', this.onDragMove);
  };
}
