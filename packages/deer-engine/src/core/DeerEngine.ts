import { CommandManager, SceneManager } from './manager';
import { ResourceManager } from './manager/AssetManager';
import { FileManager } from './manager/FileManager/FileManager';
import { IManager } from './interface';
import { Time } from './Time';
import { PhysicsScene } from './physics/PhysicsScene';
import { PxPhysics } from '../module/physics';

export class DeerEngine {
  private _time = new Time();

  public get time() {
    return this._time;
  }

  private _managerMap = new Map<new () => IManager, IManager>();

  private _animateID: number = -1;
  _physicsInitialized = false;

  static async create(config: EngineConfiguration) {
    const { containerId } = config;
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`cannot find dom with id '${containerId}'`);
    }

    const engine = new DeerEngine(container);
    await engine._initialize();
    return engine;
  }

  private constructor(public container: HTMLElement) {
    this.registerManager(new FileManager());
    this.registerManager(new ResourceManager());
    this.registerManager(new CommandManager());
    this.registerManager(new SceneManager());

    this.update();
  }

  async _initialize() {
    PhysicsScene._physics = new PxPhysics();
    await PhysicsScene._physics.initialize();
    this._physicsInitialized = true;
  }

  private registerManager<T extends IManager>(manager: T) {
    this._managerMap.set(manager.constructor as new () => IManager, manager);
    manager.engine = this;
    manager.init();
  }

  public getManager<T extends IManager>(manager: new () => T) {
    return this._managerMap.get(manager) as T;
  }

  private update = () => {
    this._time.update();
    this._animateID = requestAnimationFrame(this.update);
    this.getManager(SceneManager).updateScene(this._time.deltaTime);
  };

  destroy = () => {
    const mgrs = [...this._managerMap.values()];
    for (let i = mgrs.length - 1; i >= 0; i--) {
      const mgr = mgrs[i];
      mgr.destroy();
    }
    this._managerMap.clear();

    cancelAnimationFrame(this._animateID);
  };
}

export interface EngineConfiguration {
  containerId: string;
}
