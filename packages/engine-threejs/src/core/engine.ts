import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Loader } from './loader';
import * as THREE from 'three';
import { Control } from './control';

export class Engine {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: Control;

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

    const load = async (url: string) => {
      const t = await this.loader.loadTexture(url);
      scene.environment = t;
      scene.background = t;
    };

    load(defaulteHDRUrl);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.controls = new Control(camera, renderer);
    this.animateID = requestAnimationFrame(this.update);
  }

  update = () => {
    requestAnimationFrame(this.update);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  dispose = () => {
    const clearMatAndGeo = (obj: THREE.Mesh) => {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => m.dispose());
      } else {
        obj.material.dispose();
      }
      obj.geometry.dispose();
    };

    const removeObj = (obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh) {
        clearMatAndGeo(obj);
      }

      for (const o of obj.children) {
        removeObj(o);
      }

      obj.clear();
    };

    removeObj(this.scene);
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.parentEl.removeChild(this.renderer.domElement);

    cancelAnimationFrame(this.animateID);
  };
}
