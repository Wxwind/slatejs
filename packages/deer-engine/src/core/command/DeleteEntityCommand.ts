import { ICommand } from '@/packages/command';
import { isNil } from '@/util';
import * as THREE from 'three';
import { DeerEngine } from '../DeerEngine';
import { DeerScene } from '../DeerScene';
import { CommandId } from './type';

export class DeleteEntityCommand implements ICommand {
  id: CommandId = 'DeleteEntity';

  constructor(private scene: DeerScene, private entityId: string) {}

  execute: () => void = () => {
    this.scene.entityManager.removeEntityById(this.entityId);
  };

  undo: () => void = () => {
    // TODO: undo delete entity
  };

  toString: () => string = () => {
    return `DeleteEntityCommand: entityId = ${this.entityId}`;
  };
}
