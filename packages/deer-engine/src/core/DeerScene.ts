import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three';
import { EntityManager } from './manager/EntityManager';
import { DeerEngine } from './DeerEngine';
import { Entity, EntityJson } from './entity';
import { ResourceManager } from './manager/ResourceManager';
import { ComponentManager } from './manager/ComponentManager';
import { AbstractSceneManager } from './interface';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js';
import { PhysicsScene } from './physics/PhysicsScene';
import { deserializeComponent } from '@/util';
import { Control } from './Control';
import { WebCanvas } from './WebCanvas';
import { InputManager } from './manager';
import { Camera } from './Camera';

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

  mode: DeerSceneMode;

  camera: Camera;

  engine: DeerEngine;

  canvas: WebCanvas;

  _isDestroyed = false;

  readonly physicsScene = new PhysicsScene(this);

  // TODO: remove entityManager
  readonly entityManager = new EntityManager(this);

  private _managerMap = new Map<new () => AbstractSceneManager, AbstractSceneManager>();

  readonly control: Control;

  rootEntities: Entity[] = [];

  private _renderer: WebGLRenderer;
  private _viewHelper: ViewHelper;

  isInitialized = false;

  active = true;

  private _updateManagers: AbstractSceneManager[] = [];

  constructor(engine: DeerEngine, container: HTMLElement, mode: DeerSceneMode) {
    this.engine = engine;
    this.mode = mode;
    this.parentEl = container;

    this.sceneObject = new Scene();

    const camera = new PerspectiveCamera(75, this.parentEl.clientWidth / this.parentEl.clientHeight, 0.1, 10000);
    camera.position.set(25, 10, -25);
    // camera.rotateY(deg2rad(45));
    // camera.rotateX(deg2rad(-45));

    this.camera = new Camera(camera);

    // init renderer
    const renderer = new WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    this.canvas = new WebCanvas(renderer.domElement);
    this._renderer = renderer;

    this.control = new Control(camera, this._renderer.domElement);

    this._viewHelper = new ViewHelper(camera, container);
  }

  init() {
    this.registerManager(new ComponentManager());
    this.registerManager(new InputManager());
    this.isInitialized = true;
  }

  update = (deltaTime: number) => {
    if (!this.isInitialized) return;

    // resize on update to avoid flash
    const size = new Vector2(0, 0);
    this._renderer.getSize(size);

    const parentSize = this.parentEl.getBoundingClientRect();
    if (parentSize.width !== size.x || parentSize.height !== size.y) {
      this.resize(parentSize.width, parentSize.height);
    }

    // update renderer
    this._renderer.clear();
    this._renderer.render(this.sceneObject, this.camera.main);
    this._renderer.autoClear = false;
    this._viewHelper.render(this._renderer);
    this._renderer.autoClear = true;
    this.control.update(deltaTime);
    const inputManager = this.getManager(InputManager)!;
    inputManager.update();

    const componentManager = this.getManager(ComponentManager);

    // fire 'onStart'
    componentManager.callScriptOnStart();

    // update physics and fire 'onFixedUpdate'
    if (this.engine._physicsInitialized) {
      this.physicsScene.update(deltaTime);
    }

    // fire 'onPointerXXX'
    this.engine._physicsInitialized && inputManager._firePointerScript(this);

    // fire 'onUpdate'
    componentManager.callScriptOnUpdate(deltaTime);
  };

  private registerManager<T extends AbstractSceneManager>(manager: T) {
    this._managerMap.set(manager.constructor as new () => AbstractSceneManager, manager);
    manager.engine = this.engine;
    manager.scene = this;
    manager.init();
    if (AbstractSceneManager.prototype.update !== manager.update) {
      this._updateManagers.push(manager);
    }
  }

  public getManager<T extends AbstractSceneManager>(manager: new (...args: any[]) => T) {
    return this._managerMap.get(manager) as T;
  }

  private resize = (width: number, height: number) => {
    this.camera.main.aspect = width / height;
    this.camera.main.updateProjectionMatrix();
    this._renderer?.setSize(width, height);
    this.canvas.width = width;
    this.canvas.height = height;
  };

  loadHDR = async (fileId: string) => {
    const assetManager = this.engine.getManager(ResourceManager);
    const t = (await assetManager.loadTextureAsync(fileId)) || null;
    this.sceneObject.environment = t;
    this.sceneObject.background = t;
  };

  addRootEntity = (entity: Entity) => {
    this.rootEntities.push(entity);
    this.sceneObject.add(entity.sceneObject);
    this.active ? entity._processActive() : entity._processInActive;
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
    if (this._isDestroyed) {
      return;
    }
    this._isDestroyed = true;
    this.entityManager.destory();
    this.rootEntities.forEach((entity) => entity.destroy());

    // destroy renderer
    this._renderer.dispose();
    this._renderer.forceContextLoss();
    const container = this.parentEl;
    container.removeChild(this._renderer.domElement);
    this.physicsScene.destroy();
  };

  serialize(): DeerSceneJson {
    return {
      id: this.id,
      name: this.name,
      entities: this.rootEntities.map((a) => a.serialize()),
    };
  }

  deserialize(data: DeerSceneJson) {
    this.id = data.id;
    this.name = data.name;
    const deserializeEntity = (entityJson: EntityJson, parent: undefined | Entity) => {
      const entity = this.entityManager.createEntity(entityJson.name, undefined);
      entity.id = entityJson.id;
      entityJson.components.forEach((comp) => deserializeComponent(comp, entity));

      for (const child of entityJson.children) {
        deserializeEntity(child, entity);
      }

      return entity;
    };
    for (const entityJson of data.entities) {
      deserializeEntity(entityJson, undefined);
    }
  }
}
