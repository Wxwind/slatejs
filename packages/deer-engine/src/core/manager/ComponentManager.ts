import { AbstractSceneManager } from '../../core/interface';
import { DisorderedArray } from '../DisorderedMap';
import { Script } from '../component/Script';

export class ComponentManager extends AbstractSceneManager {
  init(): void {}

  destroy(): void {}

  // --------生命周期管理--------

  private _onStartComps: DisorderedArray<Script> = new DisorderedArray();
  private _onUpdateComps: DisorderedArray<Script> = new DisorderedArray();
  private _onFixedUpdateComps: DisorderedArray<Script> = new DisorderedArray();

  addOnStartScript(comp: Script) {
    comp._onStartIndex = this._onStartComps.length;
    this._onStartComps.add(comp);
  }

  removeOnStartScript(comp: Script) {
    const replaced = this._onStartComps.deleteByIndex(comp._onStartIndex);
    replaced && (replaced._onStartIndex = comp._onStartIndex);
    comp._onStartIndex = -1;
  }

  addOnUpdateScript(comp: Script) {
    comp._onUpdateIndex = this._onUpdateComps.length;
    this._onUpdateComps.add(comp);
  }

  removeOnUpdateScript(comp: Script) {
    const replaced = this._onUpdateComps.deleteByIndex(comp._onUpdateIndex);
    replaced && (replaced._onUpdateIndex = comp._onUpdateIndex);
    comp._onUpdateIndex = -1;
  }

  addOnFixedUpdateScript(comp: Script) {
    comp._onFixedUpdateIndex = this._onFixedUpdateComps.length;
    this._onFixedUpdateComps.add(comp);
  }

  removeOnFixedUpdateScript(comp: Script) {
    const replaced = this._onFixedUpdateComps.deleteByIndex(comp._onFixedUpdateIndex);
    replaced && (replaced._onFixedUpdateIndex = comp._onFixedUpdateIndex);
    comp._onFixedUpdateIndex = -1;
  }

  callScriptOnStart() {
    const onStartComps = this._onStartComps;
    if (onStartComps.length > 0) {
      onStartComps.forEachAndClean(
        (comp) => {
          comp._isStarted = true;
          this.removeOnStartScript(comp);
          comp._onStart();
        },
        (element, index) => {
          element._onStartIndex = index;
        }
      );
    }
  }

  callScriptOnUpdate(dt: number) {
    this._onUpdateComps.forEach(
      (comp) => {
        comp._isStarted && comp.onUpdate(dt);
      },
      (element, index) => {
        element._onUpdateIndex = index;
      }
    );
  }

  callScriptOnFixedUpdate() {
    this._onFixedUpdateComps.forEach(
      (comp) => {
        comp._isStarted && comp.onFixedUpdate();
      },
      (element, index) => {
        element._onFixedUpdateIndex = index;
      }
    );
  }

  // ----------------------
}
