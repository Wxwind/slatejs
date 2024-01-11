import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Loader } from './Loader';
import { Control } from './Control';
import { EntityManager } from './manager/EntityManager';
import { TransformComponent } from './component';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js';

export class DeerScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: Control;
  viewHelper: ViewHelper;
  animateID: number = -1;

  parentEl: HTMLElement;

  loader: Loader = new Loader();

  private readonly clock = new Clock();

  // Manager
  readonly entityManager = new EntityManager(this);

  constructor(containerId: string, defaulteHDRUrl: string) {
    const container = document.getElementById(containerId);
    if (container) {
      this.parentEl = container;
    } else {
      throw new Error(`找不到id为${containerId}的dom节点`);
    }

    const scene = new Scene();

    const camera = new PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10000);
    camera.position.set(20, 20, 0);

    const renderer = new WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    this.viewHelper = new ViewHelper(camera, container);

    const load = async (url: string) => {
      const t = await this.loader.loadTexture(url);
      scene.environment = t;
      scene.background = t;
    };

    load(defaulteHDRUrl);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = new Control(camera, renderer.domElement);
    this.update();

    window.addEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = () => {
    this.camera.aspect = this.parentEl.clientWidth / this.parentEl.clientHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.parentEl.clientWidth, this.parentEl.clientHeight);
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

  // load new scene from .egasset file
  loadSceneAsync = async () => {
    this.dispose();
  };

  saveScene = () => {};

  addChild = (trans: TransformComponent) => {
    this.scene.add(trans.rootObj);
  };

  dispose = () => {
    this.entityManager.onDestory();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.viewHelper.dispose();
    this.parentEl.removeChild(this.renderer.domElement);

    cancelAnimationFrame(this.animateID);

    window.removeEventListener('resize', this.onWindowResize);
  };
}
