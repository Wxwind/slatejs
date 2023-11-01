import { isNil } from '@/util';
import { CreateEntityCommand, DeerScene } from '..';
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
    const cmd = new CreateEntityCommand(this.scene, this.scene.scene);
    this.scene.commandManager.execute(cmd);
    this.refreshData();
  };

  deleteEntity = () => {
    const cmd = new CreateEntityCommand(this.scene, this.scene.scene);
    this.scene.commandManager.execute(cmd);
    this.refreshData();
  };

  refreshData: () => void = () => {
    this.data = { data: null, createEntity: this.createEntity };
    this.emit();
  };
}
