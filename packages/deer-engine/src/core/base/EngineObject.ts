import { DeerEngine } from '../DeerEngine';
import { DeerScene } from '../DeerScene';

export abstract class SceneObject {
  protected _scene: DeerScene;

  public get scene(): DeerScene {
    return this._scene;
  }

  public get engine(): DeerEngine {
    return this._scene.engine;
  }

  constructor(scene: DeerScene) {
    this._scene = scene;
  }
}
