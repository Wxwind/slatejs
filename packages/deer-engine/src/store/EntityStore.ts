import { CreateEntityCommand, DeerScene, DeleteEntityCommand } from '..';
import { StoreBase } from './StoreBase';

export type EntityStoreData = {
  data: unknown;
  createEntity: (parentId?: string | null) => void;
  deleteEntity: (entityId: string) => void;
};

export class EntityStore extends StoreBase<EntityStoreData> {
  constructor(private scene: DeerScene) {
    super();
  }

  createEntity = (parentId: string | null = null) => {
    const cmd = new CreateEntityCommand(this.scene, parentId, 'Object Cube');
    this.scene.commandManager.execute(cmd);
  };

  deleteEntity = (entityId: string) => {
    const cmd = new DeleteEntityCommand(this.scene, entityId);
    this.scene.commandManager.execute(cmd);
  };

  refreshData: () => void = () => {
    this.data = { data: null, createEntity: this.createEntity, deleteEntity: this.deleteEntity };
    this.emit();
  };
}
