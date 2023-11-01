import * as THREE from 'three';
import { Component } from './Component';
import { DeerScene } from '../DeerScene';
import { genUUID } from '@/util/utils';
import { UUID_PREFIX_COMP } from '@/config';
import { isNil } from '@/util';
import { ComponentType } from './type';

export class MeshComponent extends Component {
  type: ComponentType = 'Mesh';

  private obj: THREE.Mesh | null = null;

  constructor(private scene: DeerScene, parent: THREE.Object3D) {
    super();
    const geometry = new THREE.BoxGeometry();
    const mat = new THREE.MeshStandardMaterial();

    const cube = new THREE.Mesh(geometry, mat);
    cube.updateMatrix();
    parent.add(cube);

    this.obj = cube;
    this.parent = parent;
    this.scene.entityStore.refreshData();
    this.id = genUUID(UUID_PREFIX_COMP);
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
    this.parent?.remove(this.obj);
  };
}
