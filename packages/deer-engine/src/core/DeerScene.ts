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

  _rootEntities: Entity[] = [];

  private _renderer: WebGLRenderer;
  private _viewHelper: ViewHelper;

  isInitialized = false;

  // not used yet, designed to indicate the hierarchy visibility
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

  async loadHDR(fileId: string) {
    const assetManager = this.engine.getManager(ResourceManager);
    const t = (await assetManager.loadTextureAsync(fileId)) || null;
    this.sceneObject.environment = t;
    this.sceneObject.background = t;
  }

  addRootEntity(child: Entity, index?: number): void {
    const isRoot = child._isRoot;
    const oldScene = child.scene;
    if (!isRoot) {
      child._removeFromParent();
      child._isRoot = true;
    } else if (oldScene !== this) {
      oldScene._removeFromRootEntities(child);
    }
    this._addToRootEntities(child, index);
    if (child._activeInScene && oldScene !== this) {
      // inActive first then activate it
      child._processInActive();
    }
    if (child._active && (!child._activeInScene || oldScene !== this)) {
      child._processActive();
    }
  }

  createRootEntity(name?: string) {
    const entity = new Entity(this);
    this.addRootEntity(entity);
    return entity;
  }

  removeRootEntity(entity: Entity): void {
    if (entity._isRoot && entity.scene === this) {
      this._removeFromRootEntities(entity);
      entity._isRoot = false;
      entity._activeInScene && entity._processInActive();
    }
  }

  private _addToRootEntities(child: Entity, index?: number) {
    if (index === undefined) {
      child.siblingIndex = this._rootEntities.length;
      this._rootEntities.push(child);
    } else {
      const rootEntities = this._rootEntities;
      const rootEntitiesCount = rootEntities.length;
      if (index < 0 || index > rootEntitiesCount) {
        throw new Error(`Set sibling index failed: index out of bounds [0,${rootEntitiesCount}]`);
      }
      this._rootEntities.splice(index, 0, child);
      for (let i = index + 1; i < rootEntitiesCount + 1; i++) {
        rootEntities[i]._siblingIndex++;
      }
    }

    this.sceneObject.add(child.sceneObject);
  }

  _removeFromRootEntities(entity: Entity) {
    const rootEntities = this._rootEntities;
    const index = entity._siblingIndex;
    rootEntities.splice(index, 1);
    for (let i = index; i < rootEntities.length; i++) {
      rootEntities[i]._siblingIndex--;
    }
    this.sceneObject.remove(entity.sceneObject);
  }

  destroy = () => {
    if (this._isDestroyed) {
      return;
    }
    this._isDestroyed = true;
    this.entityManager.destory();

    for (let i = this._rootEntities.length - 1; i >= 0; i--) {
      this._rootEntities[i].destroy();
    }

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
      entities: this._rootEntities.map((a) => a.serialize()),
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
