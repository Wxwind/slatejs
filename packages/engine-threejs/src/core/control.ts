import { PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Control {
  private controls: OrbitControls;

  constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {
    this.controls = new OrbitControls(camera, renderer.domElement);
  }

  update = () => {
    this.controls.update();
  };
}
