import { Signal } from 'eventtool';
import { DeerScene, DeerSceneJson, DeerSceneMode } from '../DeerScene';
import { AbstractManager } from '../interface';
import { genUUID } from '@/util';
import { SafeLoopArray } from '@/util/SafeLoopArray';

export enum LoadSceneMode {
  Single,
  Additive,
}

export class SceneManager extends AbstractManager {
  private _scenes = new SafeLoopArray<DeerScene>();

  private _mainScene: DeerScene | undefined;

  public get mainScene(): DeerScene | undefined {
    return this._mainScene;
  }

  public set mainScene(v: DeerScene | undefined) {
    this._mainScene = v;
    this.signals.sceneUpdated.emit();
  }

  signals = {
    sceneUpdated: new Signal(),
  };

  init(): void {}

  createScene = (name: string, mode: DeerSceneMode) => {
    const scene = new DeerScene(this.engine, this.engine.container, mode);
    scene.id = genUUID();
    scene.name = name;
    this._scenes.push(scene);
    scene.init();
    return scene;
  };

  loadScene = (sceneJson: DeerSceneJson, mode: DeerSceneMode, loadSceneMode: LoadSceneMode) => {
    const scene = new DeerScene(this.engine, this.engine.container, mode);
    scene.init();
    scene.deserialize(sceneJson);
    if (loadSceneMode === LoadSceneMode.Single) {
      for (const s of this._scenes.getLoopArray()) {
        s.destroy();
      }
      this._scenes.clear();
      this.mainScene = scene;
      this._scenes.push(scene);
    } else {
      this._scenes.push(scene);
    }
  };

  updateScene = (deltaTime: number) => {
    for (const scene of this._scenes.getLoopArray()) {
      scene.update(deltaTime);
    }
  };

  deleteScene = (name: string) => {
    const index = this._scenes.findIndex((a) => a.name === name);
    if (index === -1) return;
    const scene = this._scenes.removeByIndex(index);
    if (scene === this.mainScene) {
      throw new Error('can not unload main scene');
    }
    this._scenes.removeByIndex(index);
    this.signals.sceneUpdated.emit();
  };

  exportScene = (scene: DeerScene) => {
    const sceneData = scene.serialize();
    return sceneData;
  };

  importScene = async (file: File, mode: DeerSceneMode, loadSceneMode: LoadSceneMode) => {
    const buffer = await file.arrayBuffer();
    const uint8_msg = new Uint8Array(buffer);
    const decodedString = String.fromCharCode.apply(uint8_msg);
    const data = JSON.parse(decodedString);

    this.loadScene(data, mode, loadSceneMode);
  };

  destroy(): void {
    this._scenes.getArray().forEach((scene) => scene.destroy());
    this._scenes.clear();
    this.mainScene = undefined;
  }
}
