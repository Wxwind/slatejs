import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Loader } from './Loader';
import * as THREE from 'three';
import { Control } from './Control';
import { CommandManager } from '@/packages/command';
import { EntityStore } from '@/store/EntityStore';

export class DeerScene {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: Control;

  animateID: number = -1;

  parentEl: HTMLElement;

  loader: Loader = new Loader();

  public readonly clock = new Clock();
  readonly commandManager = new CommandManager();
  readonly entityStore = new EntityStore(this);

  constructor(containerId: string, defaulteHDRUrl: string) {
    const el = document.getElementById(containerId);
    if (el) {
      this.parentEl = el;
    } else {
      throw new Error(`找不到id为${containerId}的dom节点`);
    }

    const scene = new Scene();

    const camera = new PerspectiveCamera(75, el.clientWidth / el.clientHeight, 0.1, 10000);
    camera.position.set(400, 200, 0);

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

  // load new scene from .egAsset file
  loadSceneAsync = async () => {
    this.dispose();
  };

  saveScene = () => {};

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

    window.removeEventListener('resize', this.onWindowResize);
  };
}
