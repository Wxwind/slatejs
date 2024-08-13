import { ICommand } from '@/packages/command';
import { DeerScene } from '../DeerScene';
import { CommandType } from './type';

export class SelectEntityCommand implements ICommand {
  type: CommandType = 'SelectEntity';

  private oldSelectedId: string | undefined;

  constructor(
    private scene: DeerScene,
    private entityId: string | undefined
  ) {}

  execute: () => boolean = () => {
    this.scene.entityManager.select(this.entityId);
    return true;
  };

  undo: () => boolean = () => {
    this.scene.entityManager.select(this.oldSelectedId);
    return true;
  };

  toString: () => string = () => {
    return `${this.type}Command: entityId = ${this.entityId}`;
  };
}
