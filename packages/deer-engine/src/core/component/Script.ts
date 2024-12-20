import { ComponentManager, Pointer } from '../manager';
import { Collider } from '../physics';
import { RigidbodyComponent } from '../physics/RigidbodyComponent';
import { ComponentBase } from './ComponentBase';

export class Script extends ComponentBase {
  public type = 'Script' as const;

  private _started: boolean = false;

  _entityScriptsIndex = -1;

  onAwake(): void {}

  onStart(): void {}

  onEnable(): void {}

  onDisable(): void {}

  onUpdate(deltaTime: number): void {}

  onFixedUpdate(): void {}

  onDestroy(): void {}

  override _onAwake(): void {
    this.onAwake();
  }

  override _onDestroy(): void {
    this.onDestroy();
  }

  override _onEnable(): void {
    const componentManger = this.scene.getManager(ComponentManager)!;
    const { prototype } = Script;

    if (!this._started) {
      componentManger.addOnStartScript(this);
    }
    if (this.onUpdate !== prototype.onUpdate) {
      componentManger.addOnUpdateScript(this);
    }
    if (this.onFixedUpdate !== prototype.onFixedUpdate) {
      componentManger.addOnFixedUpdateScript(this);
    }
    this.entity._addScript(this);

    this.onEnable();
  }

  override _onDisable(): void {
    const componentManger = this.scene.getManager(ComponentManager)!;
    const { prototype } = Script;

    if (!this._started) {
      componentManger.removeOnStartScript(this);
    }
    if (this.onUpdate !== prototype.onUpdate) {
      componentManger.removeOnUpdateScript(this);
    }
    if (this.onFixedUpdate !== prototype.onFixedUpdate) {
      componentManger.removeOnFixedUpdateScript(this);
    }
    this.entity._removeScript(this);

    this.onDisable();
  }

  onPointerDown(pointer: Pointer): void {}

  onPointerUp(pointer: Pointer): void {}

  onPointerClick(pointer: Pointer): void {}

  onPointerEnter(pointer: Pointer): void {}

  onPointerExit(pointer: Pointer): void {}

  onPointerDrag(pointer: Pointer): void {}

  onCollisionEnter(other: Collider): void {}

  onCollisionStay(other: Collider): void {}

  onCollisionExit(other: Collider): void {}

  onTriggerEnter(other: Collider): void {}

  onTriggerStay(other: Collider): void {}

  onTriggerExit(other: Collider): void {}

  updateByJson(): void {}

  onSerialize() {
    return {};
  }

  onDeserialize(): void {}
}
