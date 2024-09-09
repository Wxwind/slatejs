import { Signal } from 'eventtool';
import { DeerScene, DeerSceneMode } from '../DeerScene';
import { AbstractManager } from '../interface';
import { genUUID, isNil } from '@/util';

export class SceneManager extends AbstractManager {
  private _sceneMap = new Map<string, DeerScene>();

  private _activeScene: DeerScene | undefined;

  public get activeScene(): DeerScene | undefined {
    return this._activeScene;
  }

  public set activeScene(v: DeerScene | undefined) {
    this._activeScene = v;
    this.signals.activeSceneUpdated.emit();
  }

  signals = {
    activeSceneUpdated: new Signal(),
  };

  init(): void {}

  createScene = (name: string, mode: DeerSceneMode) => {
    if (this.engine.containerId === undefined) {
      console.error('containerId is nil');
      return;
    }
    const scene = new DeerScene(this.engine, this.engine.containerId, mode);
    scene.id = genUUID();
    scene.name = name;
    this._sceneMap.set(scene.id, scene);
    this._activeScene = scene;
    return scene;
  };

  getScene = (id: string) => {
    return this._sceneMap.get(id);
  };

  updateScene = (deltaTime: number) => {
    this._activeScene?.update(deltaTime);
  };

  deleteScene = (id: string) => {
    const scene = this._sceneMap.get(id);
    if (isNil(scene)) return;
    scene.onDestroy();
    if (scene === this.activeScene) {
      this.activeScene = undefined;
    }
    return this._sceneMap.delete(id);
  };

  exportScene = (scene: DeerScene) => {
    const sceneData = scene.serialize();
    return sceneData;
  };

  importScene = async (file: File, mode: DeerSceneMode) => {
    if (this.engine.containerId === undefined) {
      console.error('containerId is nil');
      return;
    }
    const buffer = await file.arrayBuffer();
    const uint8_msg = new Uint8Array(buffer);
    const decodedString = String.fromCharCode.apply(uint8_msg);
    const data = JSON.parse(decodedString);

    const scene = new DeerScene(this.engine, this.engine.containerId, mode);
    scene.deserialize(data);
    this._sceneMap.set(this.engine.containerId, scene);
    this._activeScene = scene;
  };

  destroy(): void {
    this._sceneMap.forEach((scene) => scene.onDestroy());
    this._sceneMap.clear();
    this.activeScene = undefined;
  }
}
