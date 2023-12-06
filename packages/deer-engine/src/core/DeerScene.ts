import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Loader } from './Loader';
import { Control } from './Control';
import { EntityManager } from './manager/EntityManager';
import { TransformComponent } from './component';

export class DeerScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: Control;

  animateID: number = -1;

  parentEl: HTMLElement;

  loader: Loader = new Loader();

  private readonly clock = new Clock();

  // Manager
  readonly entityManager = new EntityManager(this);

  constructor(containerId: string, defaulteHDRUrl: string) {
    const el = document.getElementById(containerId);
    if (el) {
      this.parentEl = el;
    } else {
      throw new Error(`找不到id为${containerId}的dom节点`);
    }

    const scene = new Scene();

    const camera = new PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 10000);
    camera.position.set(20, 20, 0);

    const renderer = new WebGLRenderer();
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

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
    this.renderer.render(this.scene, this.camera);
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
    this.parentEl.removeChild(this.renderer.domElement);

    cancelAnimationFrame(this.animateID);

    window.removeEventListener('resize', this.onWindowResize);
  };
}
