export interface IEditHelper {
  onEnter(): void;
  onUpdate(dt: number): void;
  onLeave(): void;
  onDestroy(): void;

  updateControlPoints(): void;
}
