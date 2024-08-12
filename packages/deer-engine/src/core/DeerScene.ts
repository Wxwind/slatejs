import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Control } from './Control';
import { EntityManager } from './manager/EntityManager';
import { TransformComponent } from './component';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js';
import { debounce } from '@/util';
import { deerEngine } from './DeerEngine';

export class DeerScene {
  id: string;
  name: string;

  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: Control;
  viewHelper: ViewHelper;
  animateID: number = -1;

  parentEl: HTMLElement;
  resizeObserver: ResizeObserver;

  private readonly clock = new Clock();

  // Manager
  readonly entityManager = new EntityManager(this);

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (container) {
      this.parentEl = container;
    } else {
      throw new Error(`找不到id为${containerId}的dom节点`);
    }

    this.id = '0';
    this.name = '';
    const scene = new Scene();

    const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10000);
    camera.position.set(20, 20, 0);

    const renderer = new WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    this.viewHelper = new ViewHelper(camera, container);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = new Control(camera, renderer.domElement);
    this.update();

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
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  private update = () => {
    this.animateID = requestAnimationFrame(this.update);
    this.controls.update(this.clock.getDelta());
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.autoClear = false;
    this.viewHelper.render(this.renderer);
    this.renderer.autoClear = true;
  };

  loadHDR = async (fileId: string) => {
    const t = (await deerEngine.assetManager.loadTextureAsync(fileId)) || null;
    this.scene.environment = t;
    this.scene.background = t;
  };

  // TODO: load new scene from .egasset file
  deserialize = (data: unknown) => {};

  serialize = () => {};

  addChild = (trans: TransformComponent) => {
    this.scene.add(trans.rootObj);
  };

  removeChild = (trans: TransformComponent) => {
    this.scene.remove(trans.rootObj);
  };

  destroy = () => {
    this.entityManager.onDestory();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.viewHelper.dispose();
    this.resizeObserver.unobserve(this.parentEl);
    this.parentEl.removeChild(this.renderer.domElement);

    cancelAnimationFrame(this.animateID);
  };
}
