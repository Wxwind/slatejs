import { Scene } from 'three';
import { EntityManager } from './manager/EntityManager';
import { RendererComponent } from './component';
import { debounce } from '@/util';
import { deerEngine } from './DeerEngine';
import { Entity, EntityJson } from './entity';
import { CameraComponent } from './component/scene/CameraComponent';
import { ViewHelperComponent } from './component/scene/ViewHelperComponent';

export interface DeerSceneJson {
  id: string;
  name: string;
  entities: EntityJson;
}

export class DeerScene extends Entity {
  id: string = '0';
  name: string = '';

  scene: Scene;

  parentEl: HTMLElement;
  resizeObserver: ResizeObserver;

  // Manager
  readonly entityManager = new EntityManager(this);

  constructor(containerId: string) {
    super(true);
    const container = document.getElementById(containerId);
    if (container) {
      this.parentEl = container;
    } else {
      throw new Error(`cannot find dom with id '${containerId}'`);
    }
    this.addComponentByNew(CameraComponent).camera;
    this.addComponentByNew(RendererComponent);
    this.addComponentByNew(ViewHelperComponent);

    this.root = this;
    this.scene = this.sceneObject as Scene;

    this.parent = undefined;

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
    this.findComponentByType<CameraComponent>('CameraComponent')?.resize(width, height);
    this.findComponentByType<RendererComponent>('RendererComponent')?.resize(width, height);
  };

  loadHDR = async (fileId: string) => {
    const t = (await deerEngine.assetManager.loadTextureAsync(fileId)) || null;
    this.scene.environment = t;
    this.scene.background = t;
  };

  destroy = () => {
    this.entityManager.destory();
    this.resizeObserver.unobserve(this.parentEl);
  };
}
