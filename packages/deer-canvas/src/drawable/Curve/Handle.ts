import { Circle, CircleStyleProps } from '../Circle';
import { FederatedPointerEvent } from '../../events';
import { Vector2 } from '../../util';

export class Handle {
  private onDragMoveCallBack: ((localPos: Vector2) => void) | undefined = undefined;

  constructor(private circle: Circle) {
    circle.addEventListener('pointerdown', this.onDragStart);
    circle.addEventListener('pointerup', this.onDragEnd);
    circle.addEventListener('pointerupoutside', this.onDragEnd);

    circle.cursor = 'pointer';
  }

  setOptions(options: Partial<CircleStyleProps>) {
    this.circle.setOptions(options);
  }

  setDragMoveHandler = (fn: (localPos: Vector2) => void) => {
    this.onDragMoveCallBack = fn;
  };

  onDragStart = () => {
    this.circle.ownerCanvas.root.addEventListener('pointermove', this.onDragMove);
  };

  onDragMove = (e: FederatedPointerEvent) => {
    const localP = this.circle.toLocal({ x: e.globalX, y: e.globalY });
    this.onDragMoveCallBack?.(localP);
  };

  onDragEnd = (e: FederatedPointerEvent) => {
    console.log('drag end', e.type);
    this.circle.ownerCanvas.root.removeEventListener('pointermove', this.onDragMove);
  };
}
