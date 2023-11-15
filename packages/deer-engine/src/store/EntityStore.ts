import { isNil } from '@/util';
import { CreateEntityCommand, DeerScene, DeleteEntityCommand } from '..';
import { StoreBase } from './StoreBase';
import { Object3D } from 'three';

export type EntityStoreData = {
  data: unknown;
  createEntity: () => void;
};

export class EntityStore extends StoreBase<EntityStoreData> {
  constructor(private scene: DeerScene) {
    super();
  }

  createEntity = (parentId: string | null = null) => {
    // TODO: support set parent
    // let parentObj: Object3D = this.scene.scene;
    // if (!isNil(parentId)) {
    //   const p = this.scene.entityManager.getEntityById(parentId);
    //   p && (parentObj = p);
    // }
    const cmd = new CreateEntityCommand(this.scene, null, 'Object Cube');
    this.scene.commandManager.execute(cmd);
  };

  deleteEntity = (entityId: string) => {
    const cmd = new DeleteEntityCommand(this.scene, entityId);
    this.scene.commandManager.execute(cmd);
  };

  refreshData: () => void = () => {
    this.data = { data: null, createEntity: this.createEntity };
    this.emit();
  };
}
