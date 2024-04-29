import { Circle, CircleStyleProps } from '../Circle';
import { FederatedPointerEvent } from '../../events';
import { Vector2 } from '../../util';
import { Signal } from 'deer-engine';

export class Handle {
  signals = {
    onDrag: new Signal<[Vector2]>(),
    onDragEnd: new Signal<[Vector2]>(),
  };

  constructor(
    private circle: Circle,
    opts?: {
      onContextMenu?: (e: FederatedPointerEvent) => void;
    }
  ) {
    circle.addEventListener('pointerdown', this.onDragStart);
    circle.addEventListener('pointerup', this.onDragEnd);
    circle.addEventListener('pointerupoutside', this.onDragEnd);
    opts?.onContextMenu && circle.addEventListener('rightclick', opts.onContextMenu);

    circle.cursor = 'pointer';
  }

  setOptions(options: Partial<CircleStyleProps>) {
    this.circle.setOptions(options);
  }

  private onDragStart = () => {
    this.circle.ownerCanvas.root.addEventListener('pointermove', this.onDragMove);
  };

  private onDragMove = (e: FederatedPointerEvent) => {
    const localP = this.circle.worldToLocal({ x: e.globalX, y: e.globalY });
    this.signals.onDrag.emit(localP);
  };

  private onDragEnd = (e: FederatedPointerEvent) => {
    this.circle.ownerCanvas.root.removeEventListener('pointermove', this.onDragMove);
    const localP = this.circle.worldToLocal({ x: e.globalX, y: e.globalY });
    this.signals.onDrag.emit(localP);
    this.signals.onDragEnd.emit(localP);
  };
}
