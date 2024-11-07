import { ComponentManager } from '../manager';
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

    this._onDisable();
  }

  updateByJson(): void {}

  onSerialize() {
    return {};
  }

  onDeserialize(): void {}
}
