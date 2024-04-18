import { Circle, CircleStyleProps } from '../Circle';
import { FederatedPointerEvent } from '../../events';
import { Vector2 } from '../../util';

export class Handle {
  private onDragMoveCallBack: (localPos: Vector2) => void;

  constructor(
    private circle: Circle,
    opts: {
      onDrag: (localPos: Vector2) => void;
      onContextMenu: (e: FederatedPointerEvent) => void;
    }
  ) {
    circle.addEventListener('pointerdown', this.onDragStart);
    circle.addEventListener('pointerup', this.onDragEnd);
    circle.addEventListener('pointerupoutside', this.onDragEnd);
    circle.addEventListener('click', opts.onContextMenu);

    circle.cursor = 'pointer';

    this.onDragMoveCallBack = opts.onDrag;
  }

  setOptions(options: Partial<CircleStyleProps>) {
    this.circle.setOptions(options);
  }

  onDragStart = () => {
    this.circle.ownerCanvas.root.addEventListener('pointermove', this.onDragMove);
  };

  onDragMove = (e: FederatedPointerEvent) => {
    const localP = this.circle.worldToLocal({ x: e.globalX, y: e.globalY });
    this.onDragMoveCallBack(localP);
  };

  onDragEnd = (e: FederatedPointerEvent) => {
    this.circle.ownerCanvas.root.removeEventListener('pointermove', this.onDragMove);
  };
}
