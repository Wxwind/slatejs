import { DeerEngine, DeerScene, THREE } from 'deer-engine';

export type ColliderToolType = 'Box' | 'Sphere' | 'Capsule' | 'Edit';
export type ColliderEditorMode = 'edit' | 'create';

export type DragParams = {
  initCoords: THREE.Vector2;
  initSize: THREE.Vector3;
  initScale: THREE.Vector3;
  pointSign: THREE.Vector3;
  startPosition: THREE.Vector3;
  /** 三维空间的对角点的世界坐标 */
  fixedPointWorldPos: THREE.Vector3;
  /** xz平面的对角线（世界坐标） */
  diagonalVector: THREE.Vector3;
};

export type ControlPointUserData = {
  id: number;
  sign: THREE.Vector3;
  originalPos: THREE.Vector3;
  dragParams: DragParams;
};

export abstract class AbstractModuleManager {
  abstract readonly name: string;

  get engine(): DeerEngine {
    return this.scene.engine;
  }

  scene: DeerScene;

  constructor(scene: DeerScene) {
    this.scene = scene;
  }

  abstract init(): void | Promise<void>;
  abstract destroy(): void;
}
