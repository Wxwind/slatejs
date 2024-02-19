import * as THREE from 'three';
import { ComponentBase } from './ComponentBase';
import { isNil } from '@/util';
import { Entity } from '../entity';
import { MeshCompJson } from './type';
import { egclass } from '../data';

@egclass()
export class MeshComponent extends ComponentBase<'MeshComponent'> {
  type = 'MeshComponent' as const;

  private mesh: THREE.Mesh;

  public get isCanBeRemoved(): boolean {
    return true;
  }

  public set entity(value: Entity | undefined) {
    value?.rootComp.rootObj.add(this.mesh);
    this._entity = value;
  }

  constructor() {
    super();
    const geometry = new THREE.BoxGeometry();
    const mat = new THREE.MeshStandardMaterial();

    const cube = new THREE.Mesh(geometry, mat);
    cube.updateMatrix();

    this.mesh = cube;
  }

  onDestory: () => void = () => {
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

  updateByJson: (data: MeshCompJson) => void = (data) => {};

  toJsonObject: () => MeshCompJson = () => {
    const count = Array.isArray(this.mesh.material) ? this.mesh.material.length : 1;

    return {
      count,
    };
  };
}
