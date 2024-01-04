import * as THREE from 'three';
import { ComponentBase } from './ComponentBase';
import { isNil } from '@/util';
import { Entity } from '../entity';
import { MeshCompJson } from './type';
import { egclass } from '../data';

@egclass()
export class MeshComponent extends ComponentBase<'Mesh'> {
  type = 'Mesh' as const;

  private obj: THREE.Mesh;

  public get isCanBeRemoved(): boolean {
    return true;
  }

  constructor(entity: Entity) {
    super(entity);
    const geometry = new THREE.BoxGeometry();
    const mat = new THREE.MeshStandardMaterial();

    const cube = new THREE.Mesh(geometry, mat);
    cube.updateMatrix();
    entity.rootComp.rootObj.add(cube);

    this.obj = cube;
  }

  onDestory: () => void = () => {
    if (isNil(this.obj)) {
      console.warn("obj doesn't exist");
      return;
    }
    if (Array.isArray(this.obj.material)) {
      this.obj.material.forEach((m) => m.dispose());
    } else {
      this.obj.material.dispose();
    }
    this.obj.geometry.dispose();
  };

  updateByJson: (data: MeshCompJson) => void = (data) => {};

  toJsonObject: () => MeshCompJson = () => {
    const count = Array.isArray(this.obj.material) ? this.obj.material.length : 1;

    return {
      count,
    };
  };
}
