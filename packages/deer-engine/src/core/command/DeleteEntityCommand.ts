import { ICommand } from '@/packages/command';
import { DeerScene } from '../DeerScene';
import { CommandType } from './type';

export class DeleteEntityCommand implements ICommand {
  type: CommandType = 'DeleteEntity';

  constructor(
    private scene: DeerScene,
    private entityId: string
  ) {}

  execute: () => boolean = () => {
    this.scene.entityManager.removeEntityById(this.entityId);
    return true;
  };

  undo: () => boolean = () => {
    // TODO: undo delete entity
    return true;
  };

  toString: () => string = () => {
    return `${this.type}Command: entityId = ${this.entityId}`;
  };
}
