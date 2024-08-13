import * as THREE from 'three';
import { ComponentBase } from './ComponentBase';
import { isNil } from '@/util';
import { Entity } from '../entity';
import { MeshComponentJson } from './type';
import { accessor, egclass } from '../decorator';

@egclass()
export class MeshComponent extends ComponentBase<'MeshComponent'> {
  type = 'MeshComponent' as const;

  private mesh: THREE.Mesh;

  public get isCanBeRemoved(): boolean {
    return true;
  }

  set owner(value: Entity) {
    value?.sceneObject.add(this.mesh);
    this._owner = value;
  }

  @accessor({ type: Number })
  public get count() {
    const count = Array.isArray(this.mesh.material) ? this.mesh.material.length : 1;
    return count;
  }

  constructor() {
    super();
    const geometry = new THREE.BoxGeometry();
    const mat = new THREE.MeshStandardMaterial();

    const cube = new THREE.Mesh(geometry, mat);
    cube.updateMatrix();

    this.mesh = cube;
  }

  awake: () => void = () => {};

  update: (dt: number) => void = () => {};

  destory: () => void = () => {
    if (isNil(this.mesh)) {
      console.warn("mesh doesn't exist");
      return;
    }
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach((m) => m.dispose());
    } else {
      this.mesh.material.dispose();
    }
    this.mesh.geometry.dispose();
  };

  updateByJson: (data: MeshComponentJson) => void = (data) => {};

  onSerialize: () => MeshComponentJson = () => {
    // TODO
    return {
      count: this.count,
    };
  };

  onDeserialize: (data: MeshComponentJson) => void = (data) => {
    // TODO
  };
}
