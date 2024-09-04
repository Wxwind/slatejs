import * as THREE from 'three';
import { ComponentBase } from './ComponentBase';
import { isNil } from '@/util';
import { MeshComponentJson } from './type';
import { accessor, egclass } from '../decorator';

@egclass()
export class MeshComponent extends ComponentBase<'MeshComponent'> {
  type = 'MeshComponent' as const;

  private _mesh!: THREE.Mesh;

  private selectedMeshType: 'Box' | 'Sphere' = 'Box';

  private set mesh(value: THREE.Mesh) {
    this._mesh = value;
    if (isNil(this.entity)) {
      console.warn('Mesh is created but owner is invalid, it will be dissociative');
      return;
    }
    this._entity.sceneObject.add(this.mesh);
  }

  private get mesh(): THREE.Mesh {
    return this._mesh;
  }

  public get isCanBeRemoved(): boolean {
    return true;
  }

  @accessor({ type: Number })
  public get count() {
    const count = Array.isArray(this.mesh.material) ? this.mesh.material.length : 1;
    return count;
  }

  onAwake: () => void = () => {
    const geometry = new THREE.BoxGeometry();
    const mat = new THREE.MeshStandardMaterial();

    const cube = new THREE.Mesh(geometry, mat);
    cube.updateMatrix();

    this.mesh = cube;
  };

  onEnabled: () => void = () => {};

  onDisabled: () => void = () => {};

  update: (dt: number) => void = () => {};

  onDestroy: () => void = () => {
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
      type: this.selectedMeshType,
    };
  };

  onDeserialize: (data: MeshComponentJson) => void = (data) => {
    this.selectedMeshType = data.type;
  };
}
