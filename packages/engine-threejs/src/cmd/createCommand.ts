import { ICommand } from '@/packages/command';
import { isNil } from '@/util';
import * as THREE from 'three';

export class CreateCommand implements ICommand {
  private obj: THREE.Mesh | null = null;

  constructor(private parent: THREE.Object3D) {}

  execute: () => void = () => {
    const geometry = new THREE.BoxGeometry();
    const mat = new THREE.MeshStandardMaterial();

    const cube = new THREE.Mesh(geometry, mat);
    this.obj = cube;
    this.parent.add(cube);
  };

  undo: () => void = () => {
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
    this.parent.remove(this.obj);
  };

  toString: () => string = () => {
    return `CreateCommand: obj = ${this.obj?.name || '<missing>'}, parent = ${this.parent?.name || '<missing>'}`;
  };
}
