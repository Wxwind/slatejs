import { FederatedPointerEvent } from '../../events';
import { Vector2 } from '../../util';
import { Signal } from 'eventtool';
import { ControlCircle, ControlCircleStyleProps } from '../ContorlCircle';

/** used only for key.tangentmode=auto, length(centerOffset) will be fixed in this case */
export class ControlHandle {
  signals = {
    onDrag: new Signal<[Vector2]>(),
    onDragEnd: new Signal<[Vector2]>(),
  };

  constructor(
    private circle: ControlCircle,
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

  setOptions(options: Partial<ControlCircleStyleProps>) {
    this.circle.setOptions(options);
  }

  private onDragStart = () => {
    this.circle.ownerCanvas.root.addEventListener('pointermove', this.onDragMove);
  };

  private onDragMove = (e: FederatedPointerEvent) => {
    const localP = { x: e.viewportX, y: e.viewportY };
    this.signals.onDrag.emit(localP);
  };

  private onDragEnd = (e: FederatedPointerEvent) => {
    this.circle.ownerCanvas.root.removeEventListener('pointermove', this.onDragMove);
    const localP = { x: e.viewportX, y: e.viewportY };
    this.signals.onDrag.emit(localP);
    this.signals.onDragEnd.emit(localP);
  };
}
