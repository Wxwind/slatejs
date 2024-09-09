import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { EntityManager } from './manager/EntityManager';
import { debounce } from '@/util';
import { DeerEngine } from './DeerEngine';
import { Entity, EntityJson } from './entity';
import { Control } from './Control';
import { AssetManager } from './manager/AssetManager';

export interface DeerSceneJson {
  id: string;
  name: string;
  entities: EntityJson;
}

export type DeerSceneMode = 'editor' | 'preview';

export class DeerScene {
  id: string = '0';
  name: string = '';

  sceneObject: Scene;

  parentEl: HTMLElement;
  resizeObserver: ResizeObserver;

  mode: DeerSceneMode;

  mainCamera: PerspectiveCamera;
  engine: DeerEngine;

  // Manager
  readonly entityManager = new EntityManager(this);
  readonly control: Control;

  rootEntities: Entity[] = [];

  private _renderer: WebGLRenderer;

  constructor(engine: DeerEngine, containerId: string, mode: DeerSceneMode) {
    this.engine = engine;
    this.mode = mode;
    const container = document.getElementById(containerId);
    if (container) {
      this.parentEl = container;
    } else {
      throw new Error(`cannot find dom with id '${containerId}'`);
    }

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

    const debouncedResize = debounce(this.resize);

    // observe resize
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      debouncedResize(width, height);
    });

    resizeObserver.observe(this.parentEl);
    this.resizeObserver = resizeObserver;
  }

  update = (deltaTime: number) => {
    // update renderer
    this._renderer.clear();
    this._renderer.render(this.sceneObject, this.mainCamera);
    this.control.update(deltaTime);

    // const viewHelperComponent = deerScene.findComponentByType<ViewHelperComponent>('ViewHelperComponent');
    // if (!isNil(viewHelperComponent)) {
    //   this._renderer.autoClear = false;
    //   viewHelperComponent.render(this._renderer);
    //   this._renderer.autoClear = true;
    // }
  };

  private resize = (width: number, height: number) => {
    this.mainCamera.aspect = width / height;
    this.mainCamera.updateProjectionMatrix();
    this._renderer?.setSize(width, height);
  };

  loadHDR = async (fileId: string) => {
    const assetManager = this.engine.getManager(AssetManager);
    const t = (await assetManager.loadTextureAsync(fileId)) || null;
    this.sceneObject.environment = t;
    this.sceneObject.background = t;
  };

  addRootEntity = (entity: Entity) => {
    const isRoot = entity.isRoot;
    if (!isRoot) {
      entity.isRoot = true;
    }

    const oldScene = entity.scene;
    if (oldScene && oldScene !== this && isRoot) {
      oldScene.removeRootEntity(entity);
    }

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

  onDestroy = () => {
    this.entityManager.destory();
    // this.scene.clear();
    this.resizeObserver.unobserve(this.parentEl);

    // destroy renderer
    this._renderer.dispose();
    this._renderer.forceContextLoss();
    const container = this.parentEl;
    container.removeChild(this._renderer.domElement);
  };

  serialize() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  deserialize(data: unknown) {}
}
