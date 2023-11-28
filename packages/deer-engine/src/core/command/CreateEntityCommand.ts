import { ICommand } from '@/packages/command';
import { isNil } from '@/util';
import { DeerScene } from '../DeerScene';
import { CommandId } from './type';
import { Entity } from '../entity';
import { MeshComponent, TransformComponent } from '../component';

export class CreateEntityCommand implements ICommand {
  id: CommandId = 'CreateEntity';

  private obj: Entity | null = null;

  constructor(private scene: DeerScene, private parent: TransformComponent | string | null, private name: string) {}

  execute: () => void = () => {
    const cube = this.scene.entityManager.createEntity(this.name, this.parent);
    cube.addComponentByNew(MeshComponent);
    this.obj = cube;
  };

  undo: () => void = () => {
    if (isNil(this.obj)) {
      console.warn("obj doesn't exist");
      return;
    }
    this.obj.onDestory();
  };

  private getParentName = () => {
    if (typeof this.parent === 'string') {
      return this.scene.entityManager.findEntityById(this.parent);
    }
    return this.parent?.entity.name;
  };

  toString: () => string = () => {
    return `CreateEntityCommand: obj = ${this.obj?.name || '<missing>'}, parent = ${
      this.getParentName() || '<missing>'
    }`;
  };
}
