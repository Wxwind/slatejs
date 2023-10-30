import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Loader } from './loader';

export class Engine {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;

  animateID: number;

  parentEl: HTMLElement;

  loader: Loader = new Loader();

  constructor(containerId: string, defaulteHDRUrl: string) {
    const el = document.getElementById(containerId);
    if (el) {
      this.parentEl = el;
    } else {
      throw new Error(`找不到id为${containerId}的dom节点`);
    }

    const scene = new Scene();

    const camera = new PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const load = async (url: string) => {
      const t = await this.loader.loadTexture(url);
      scene.environment = t;
      scene.background = t;
    };

    load(defaulteHDRUrl);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.animateID = requestAnimationFrame(this.update);
  }

  update = () => {
    requestAnimationFrame(this.update);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  dispose = () => {
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.parentEl.removeChild(this.renderer.domElement);

    cancelAnimationFrame(this.animateID);
  };
}
