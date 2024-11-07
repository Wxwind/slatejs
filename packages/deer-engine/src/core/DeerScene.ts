import THREE, { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EntityManager } from './manager/EntityManager';
import { debounce } from '@/util';
import { DeerEngine } from './DeerEngine';
import { Entity, EntityJson } from './entity';
import { Control } from './Control';
import { ResourceManager } from './manager/AssetManager';
import { ComponentManager } from './manager/ComponentManager';
import { AbstractSceneManager } from './interface';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js';

export interface DeerSceneJson {
  id: string;
  name: string;
  entities: EntityJson[];
}

export type DeerSceneMode = 'editor' | 'preview';

export class DeerScene {
  id: string = '0';
  name: string = '';

  sceneObject: Scene;

  parentEl: HTMLElement;
  // resizeObserver: ResizeObserver;

  mode: DeerSceneMode;

  mainCamera: PerspectiveCamera;
  engine: DeerEngine;

  // Manager
  readonly entityManager = new EntityManager(this);

  private _managerMap = new Map<new () => AbstractSceneManager, AbstractSceneManager>();

  readonly control: Control;

  rootEntities: Entity[] = [];

  private _renderer: WebGLRenderer;
  private _viewHelper: ViewHelper;

  isInited = false;

  active = true;

  constructor(engine: DeerEngine, container: HTMLElement, mode: DeerSceneMode) {
    this.engine = engine;
    this.mode = mode;
    this.parentEl = container;

    this.sceneObject = new Scene();

    const camera = new PerspectiveCamera(75, this.parentEl.clientWidth / this.parentEl.clientHeight, 0.1, 10000);
    camera.position.set(20, 20, 0);

    this.mainCamera = camera;

    // init renderer
    const renderer = new WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    this._renderer = renderer;

    this.control = new Control(this.mainCamera, this._renderer.domElement);

    this._viewHelper = new ViewHelper(this.mainCamera, container);

    // const debouncedResize = debounce(this.resize, 200);

    // // observe resize
    // const resizeObserver = new ResizeObserver((entries) => {
    //   const { width, height } = entries[0].contentRect;
    //   debouncedResize(width, height);
    // });

    // resizeObserver.observe(this.parentEl);
    // this.resizeObserver = resizeObserver;
  }

  init() {
    this.registerManager(new ComponentManager());
    this.isInited = true;
  }

  update = (deltaTime: number) => {
    if (!this.isInited) return;

    // resize on update to avoid flash
    const size = new THREE.Vector2(0, 0);
    this._renderer.getSize(size);

    const parentSize = this.parentEl.getBoundingClientRect();
    if (parentSize.width !== size.x || parentSize.height !== size.y) {
      this.resize(parentSize.width, parentSize.height);
    }

    // update renderer
    this._renderer.clear();
    this._renderer.render(this.sceneObject, this.mainCamera);
    this._renderer.autoClear = false;
    this._viewHelper.render(this._renderer);
    this._renderer.autoClear = true;
    this.control.update(deltaTime);

    const componentManager = this.getManager(ComponentManager);
    componentManager.callScriptOnStart();
    componentManager.callScriptOnUpdate(deltaTime);
  };

  private registerManager<T extends AbstractSceneManager>(manager: T) {
    this._managerMap.set(manager.constructor as new () => AbstractSceneManager, manager);
    manager.engine = this.engine;
    manager.scene = this;
    manager.init();
  }

  public getManager<T extends AbstractSceneManager>(manager: new (...args: any[]) => T) {
    return this._managerMap.get(manager) as T;
  }

  private resize = (width: number, height: number) => {
    this.mainCamera.aspect = width / height;
    this.mainCamera.updateProjectionMatrix();
    this._renderer?.setSize(width, height);
  };

  loadHDR = async (fileId: string) => {
    const assetManager = this.engine.getManager(ResourceManager);
    const t = (await assetManager.loadTextureAsync(fileId)) || null;
    this.sceneObject.environment = t;
    this.sceneObject.background = t;
  };

  addRootEntity = (entity: Entity) => {
    entity.parent === undefined;

    this.rootEntities.push(entity);
    this.sceneObject.add(entity.sceneObject);
    console.log(this.sceneObject);
  };

  createRootEntity = (name?: string) => {
    const entity = new Entity(this);
    this.addRootEntity(entity);
    return entity;
  };

  removeRootEntity = (entity: Entity) => {
    this.rootEntities.filter((a) => a !== entity);
  };

  destroy = () => {
    this.entityManager.destory();
    // this.scene.clear();
    //  this.resizeObserver.unobserve(this.parentEl);

    // destroy renderer
    this._renderer.dispose();
    this._renderer.forceContextLoss();
    const container = this.parentEl;
    container.removeChild(this._renderer.domElement);
  };

  serialize(): DeerSceneJson {
    return {
      id: this.id,
      name: this.name,
      entities: this.rootEntities.map((a) => a.serialize()),
    };
  }

  deserialize(data: DeerSceneJson) {}
}
