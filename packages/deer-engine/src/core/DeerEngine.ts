import { isNil } from '@/util';
import { DeerScene } from './DeerScene';
import { CommandManager } from './manager';
import { Signal } from 'eventtool';

export class DeerEngine {
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

  /**
   * CommandManager is the only entry if want to exec recordable action.
   * Used by both app and engine itself.
   */
  private readonly _commandManager = new CommandManager(this);

  public get commandManager(): CommandManager {
    return this._commandManager;
  }

  createScene = (containerId: string, defaulteHDRUrl: string) => {
    const scene = new DeerScene(containerId, defaulteHDRUrl);
    this._sceneMap.set(containerId, scene);
    return scene;
  };

  getScene = (id: string) => {
    return this._sceneMap.get(id);
  };

  deleteScene = (id: string) => {
    const scene = this._sceneMap.get(id);
    if (isNil(scene)) return;
    scene.dispose();
    if (scene === this.activeScene) {
      this.activeScene = undefined;
    }
    return this._sceneMap.delete(id);
  };
}

export const deerEngine = new DeerEngine();
