import { Collider, DynamicRigidbodyComponent, IVector3, Script } from 'deer-engine';

export class CubeMoveScript extends Script {
  startPoint: IVector3 = { x: -5, y: 1, z: 0 };
  endPoint: IVector3 = { x: 5, y: 1, z: 0 };

  totalTime = 3;
  accumulator = 0;

  yoyo = false;

  rb: DynamicRigidbodyComponent | null = null;

  override onStart(): void {
    this.rb = this.entity.findComponentByType<DynamicRigidbodyComponent>('DynamicRigidbodyComponent') || null;
  }

  override onUpdate(deltaTime: number): void {
    this.accumulator += deltaTime;
    while (this.accumulator >= this.totalTime) {
      this.accumulator -= this.totalTime;
      this.yoyo = !this.yoyo;
    }
    const process = this.accumulator / this.totalTime;
    const pos = IVector3.lerp({ x: 0, y: 0, z: 0 }, this.startPoint, this.endPoint, this.yoyo ? 1 - process : process);

    this.rb!.move(pos);
  }
}
