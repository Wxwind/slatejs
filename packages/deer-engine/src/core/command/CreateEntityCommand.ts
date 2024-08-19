import { ICommand } from '@/packages/command';
import { isNil } from '@/util';
import { DeerScene } from '../DeerScene';
import { CommandType } from './type';
import { Entity } from '../entity';
import { MeshComponent } from '../component';

export class CreateEntityCommand implements ICommand {
  type: CommandType = 'CreateEntity';

  private obj: Entity | null = null;

  constructor(
    private scene: DeerScene,
    private parent: Entity | string | null,
    private name: string
  ) {}

  execute: () => boolean = () => {
    const cube = this.scene.entityManager.createEntity(this.name, this.parent);
    cube.addComponentByNew(MeshComponent);
    this.obj = cube;
    return true;
  };

  undo: () => boolean = () => {
    if (isNil(this.obj)) {
      console.warn("obj doesn't exist");
      return false;
    }
    this.obj.destroy();
    return true;
  };

  private getParentName = () => {
    if (typeof this.parent === 'string') {
      return this.scene.entityManager.findEntityById(this.parent);
    }
    return this.parent?.name;
  };

  toString: () => string = () => {
    return `${this.type}Command: obj = ${this.obj?.name || '<missing>'}, parent = ${
      this.getParentName() || '<missing>'
    }`;
  };
}
