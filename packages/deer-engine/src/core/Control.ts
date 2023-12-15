import { PerspectiveCamera } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Control {
  private controls: OrbitControls;

  constructor(camera: PerspectiveCamera, domElement: HTMLCanvasElement) {
    const controls = new OrbitControls(camera, domElement);
    controls.listenToKeyEvents(window);

    controls.enableDamping = true;

    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 5;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI / 2;

    this.controls = controls;
  }

  update = (dt: number) => {
    this.controls.update(dt);
  };
}
