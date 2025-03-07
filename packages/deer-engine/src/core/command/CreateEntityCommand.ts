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

  execute() {
    const cube = this.scene.entityManager.createEntity(this.name, this.parent);
    cube.addComponent(MeshComponent);
    this.obj = cube;
  }

  undo() {
    if (isNil(this.obj)) {
      throw new Error("obj doesn't exist");
    }
    this.obj.destroy();
  }

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
