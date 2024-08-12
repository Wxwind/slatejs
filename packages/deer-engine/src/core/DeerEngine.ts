import { genUUID, isNil } from '@/util';
import { DeerScene } from './DeerScene';
import { CommandManager } from './manager';
import { Signal } from 'eventtool';
import { AssetManager } from './manager/AssetManager/AssetManager';
import { FileManager } from './manager/FileManager/FileManager';

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
  private readonly _commandManager = new CommandManager();
  private readonly _assetManager = new AssetManager();
  private readonly _fileManager = new FileManager();

  public get commandManager(): CommandManager {
    return this._commandManager;
  }

  public get assetManager(): AssetManager {
    return this._assetManager;
  }

  public get fileManager(): FileManager {
    return this._fileManager;
  }

  constructor() {
    this._fileManager.awake();
    this._assetManager.setFileManager(this._fileManager);
  }

  private containerId: string | undefined;

  setContainerId = (containerId: string) => {
    this.containerId = containerId;
  };

  createScene = (name: string) => {
    if (this.containerId === undefined) {
      console.error('containerId is nil');
      return;
    }
    const scene = new DeerScene(this.containerId);
    scene.id = genUUID();
    scene.name = name;
    this._sceneMap.set(this.containerId, scene);
    this._activeScene = scene;
    return scene;
  };

  getScene = (id: string) => {
    return this._sceneMap.get(id);
  };

  deleteScene = (id: string) => {
    const scene = this._sceneMap.get(id);
    if (isNil(scene)) return;
    scene.destroy();
    if (scene === this.activeScene) {
      this.activeScene = undefined;
    }
    return this._sceneMap.delete(id);
  };

  destroy = () => {
    this._sceneMap.forEach((scene) => scene.destroy());
    this._sceneMap.clear();
    this.activeScene = undefined;
  };

  exportScene = (scene: DeerScene) => {
    const sceneData = scene.serialize();
  };

  importScene = async (file: File) => {
    if (this.containerId === undefined) {
      console.error('containerId is nil');
      return;
    }
    const buffer = await file.arrayBuffer();
    const uint8_msg = new Uint8Array(buffer);
    const decodedString = String.fromCharCode.apply(uint8_msg);
    const data = JSON.parse(decodedString);

    const scene = new DeerScene(this.containerId);
    scene.deserialize(data);
    this._sceneMap.set(this.containerId, scene);
    this._activeScene = scene;
  };
}

export const deerEngine = new DeerEngine();
