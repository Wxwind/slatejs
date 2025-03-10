import * as THREE from 'three';
import { Component } from './Component';
import { isNil } from '@/util';
import { accessor, egclass } from '../decorator';
import { MeshComponentJson } from './type';
import { Entity } from '../entity';

@egclass()
export class MeshComponent extends Component {
  type = 'MeshComponent' as const;

  private _mesh!: THREE.Mesh;

  private selectedMeshType: 'Box' | 'Sphere' = 'Box';

  private set mesh(value: THREE.Mesh) {
    this._mesh = value;
    if (isNil(this.entity)) {
      console.warn('Mesh is created but owner is invalid, it will be dissociative');
      return;
    }
    this.entity.sceneObject.add(this.mesh);
  }

  private get mesh(): THREE.Mesh {
    return this._mesh;
  }

  @accessor({ type: Number })
  public get count() {
    const count = Array.isArray(this.mesh.material) ? this.mesh.material.length : 1;
    return count;
  }

  public set color(v: THREE.Color) {
    (this.mesh.material as THREE.MeshStandardMaterial).color = v;
  }

  constructor(entity: Entity) {
    super(entity);
    const geometry = new THREE.BoxGeometry();
    const mat = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(geometry, mat);
    cube.updateMatrix();

    this.mesh = cube;
  }

  override _onDestroy() {
    super._onDestroy();
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
  }

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
