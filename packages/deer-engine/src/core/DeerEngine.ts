import { CommandManager, SceneManager } from './manager';
import { AssetManager } from './manager/AssetManager';
import { FileManager } from './manager/FileManager/FileManager';
import { Clock } from 'three';
import { IManager } from './interface';

export class DeerEngine {
  public containerId: string | undefined;
  /**
   * CommandManager is the only entry if want to exec recordable action.
   * Used by both app and engine itself.
   */

  private managerMap = new Map<new () => IManager, IManager>();

  private animateID: number = -1;
  private readonly clock = new Clock();

  constructor() {
    this.registerManager(new FileManager());
    this.registerManager(new AssetManager());
    this.registerManager(new CommandManager());
    this.registerManager(new SceneManager());

    this.update();
  }

  private registerManager<T extends IManager>(manager: T) {
    this.managerMap.set(manager.constructor as new () => IManager, manager);
    manager.engine = this;
    manager.init();
  }

  public getManager<T extends IManager>(manager: new () => T) {
    return this.managerMap.get(manager) as T;
  }

  private update = () => {
    this.animateID = requestAnimationFrame(this.update);
    this.getManager(SceneManager).updateScene(this.clock.getDelta());
  };

  setContainerId = (containerId: string) => {
    this.containerId = containerId;
  };

  destroy = () => {
    const mgrs = [...this.managerMap.values()];
    for (let i = mgrs.length - 1; i >= 0; i--) {
      const mgr = mgrs[i];
      mgr.destroy();
    }
    this.managerMap.clear();

    cancelAnimationFrame(this.animateID);
  };
}
