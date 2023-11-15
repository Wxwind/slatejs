import * as THREE from 'three';
import { Component } from './Component';
import { isNil } from '@/util';
import { ComponentType } from './type';
import { Entity } from '../entity';

export class MeshComponent extends Component {
  type: ComponentType = 'Mesh';

  private obj: THREE.Mesh | null = null;

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
}
