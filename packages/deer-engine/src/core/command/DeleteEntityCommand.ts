import { ICommand } from '@/packages/command';
import { DeerScene } from '../DeerScene';
import { CommandType } from './type';

export class DeleteEntityCommand implements ICommand {
  type: CommandType = 'DeleteEntity';

  constructor(
    private scene: DeerScene,
    private entityId: string
  ) {}

  execute() {
    this.scene.entityManager.removeEntityById(this.entityId);
  }

  undo() {
    // TODO: undo delete entity
  }

  toString: () => string = () => {
    return `${this.type}Command: entityId = ${this.entityId}`;
  };
}
