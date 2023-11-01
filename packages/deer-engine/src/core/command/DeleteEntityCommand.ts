import { ICommand } from '@/packages/command';
import { isNil } from '@/util';
import * as THREE from 'three';
import { DeerEngine } from '../DeerEngine';
import { DeerScene } from '../DeerScene';
import { CommandId } from './type';

export class DeleteEntityCommand implements ICommand {
  id: CommandId = 'DeleteEntity';

  private obj: THREE.Mesh | null = null;

  constructor(private scene: DeerScene, private parent: THREE.Object3D) {}

  execute: () => void = () => {};

  undo: () => void = () => {
    if (isNil(this.obj)) {
      console.warn("obj doesn't exist");
      return;
    }
  };

  toString: () => string = () => {
    return `CreateCommand: obj = ${this.obj?.name || '<missing>'}, parent = ${this.parent?.name || '<missing>'}`;
  };
}
