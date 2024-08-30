import { PerspectiveCamera, Scene } from 'three';
import { EntityManager } from './manager/EntityManager';
import { RendererComponent } from './component';
import { debounce } from '@/util';
import { deerEngine } from './DeerEngine';
import { Entity, EntityJson } from './entity';
import { CameraComponent } from './component/scene/CameraComponent';

export interface DeerSceneJson {
  id: string;
  name: string;
  entities: EntityJson;
}

export type DeerSceneMode = 'editor' | 'preview';

export class DeerScene extends Entity {
  id: string = '0';
  name: string = '';

  scene: Scene;

  parentEl: HTMLElement;
  resizeObserver: ResizeObserver;

  mode!: DeerSceneMode;

  mainCamera: PerspectiveCamera;

  // Manager
  readonly entityManager = new EntityManager(this);

  constructor(containerId: string, mode: DeerSceneMode) {
    super(true);
    this.mode = mode;
    const container = document.getElementById(containerId);
    if (container) {
      this.parentEl = container;
    } else {
      throw new Error(`cannot find dom with id '${containerId}'`);
    }

    this.root = this;
    this.scene = this.sceneObject as Scene;

    this.parent = undefined;

    const camera = new PerspectiveCamera(75, this.parentEl.clientWidth / this.parentEl.clientHeight, 0.1, 10000);
    camera.position.set(20, 20, 0);

    this.mainCamera = camera;

    const debouncedResize = debounce(this.resize);

    // observe resize
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      debouncedResize(width, height);
    });

    resizeObserver.observe(this.parentEl);
    this.resizeObserver = resizeObserver;
  }

  private resize = (width: number, height: number) => {
    this.mainCamera.aspect = width / height;
    this.mainCamera.updateProjectionMatrix();
    this.findComponentByType<RendererComponent>('RendererComponent')?.resize(width, height);
  };

  loadHDR = async (fileId: string) => {
    const t = (await deerEngine.assetManager.loadTextureAsync(fileId)) || null;
    this.scene.environment = t;
    this.scene.background = t;
  };

  onDestroy = () => {
    this.entityManager.destory();
    // this.scene.clear();
    this.resizeObserver.unobserve(this.parentEl);
  };
}
