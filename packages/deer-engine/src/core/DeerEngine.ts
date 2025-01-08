import { CommandManager, SceneManager } from './manager';
import { ResourceManager } from './manager/ResourceManager';
import { FileManager } from './manager/FileManager/FileManager';
import { AbstractManager, IManager } from './interface';
import { Time } from './Time';
import { PhysicsScene } from './physics/PhysicsScene';
import { PxPhysics } from '../module/physx-physics';

export class DeerEngine {
  private _time = new Time();
  private _isPaused = true;

  public get time() {
    return this._time;
  }

  private _managerMap = new Map<new () => AbstractManager, AbstractManager>();

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
  }

  async _initialize() {
    PhysicsScene._nativePhysics = new PxPhysics();
    await PhysicsScene._nativePhysics.initialize();
    this._physicsInitialized = true;
  }

  private registerManager<T extends AbstractManager>(manager: T) {
    this._managerMap.set(manager.constructor as new () => AbstractManager, manager);
    manager.engine = this;
    manager.init();
  }

  public getManager<T extends AbstractManager>(manager: new () => T) {
    return this._managerMap.get(manager) as T;
  }

  public run() {
    this.resume();
  }

  public pause() {
    if (this._isPaused) return;
    this._isPaused = true;
    cancelAnimationFrame(this._animateID);
  }

  public resume() {
    if (!this._isPaused) return;
    this._isPaused = false;
    this._animateID = requestAnimationFrame(this.update);
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
