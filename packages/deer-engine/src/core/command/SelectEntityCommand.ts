import { ICommand } from '@/packages/command';
import { DeerScene } from '../DeerScene';
import { CommandId } from './type';

export class SelectEntityCommand implements ICommand {
  id: CommandId = 'SelectEntity';

  private oldSelectedId: string | undefined;

  constructor(private scene: DeerScene, private entityId: string) {}

  execute: () => void = () => {
    this.oldSelectedId = this.scene.entityManager.selectedEntityId;
    this.scene.entityManager.select(this.entityId);
  };

  undo: () => void = () => {
    this.scene.entityManager.select(this.oldSelectedId);
  };

  toString: () => string = () => {
    return `DeleteEntityCommand: entityId = ${this.entityId}`;
  };
}
