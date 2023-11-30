import { isNil, replaceEqualDeep } from '@/util';
import { DeerScene, EntityInfo } from '..';
import { StoreBase } from './StoreBase';

export class SelectedEntityInfoStore extends StoreBase<EntityInfo> {
  private oldData: EntityInfo | undefined;

  constructor(public scene: DeerScene | undefined) {
    super();
  }

  refreshData: () => void = () => {
    if (isNil(this.scene)) return;
    const eId = this.scene.entityManager.selectedEntityId;
    let newData: EntityInfo | undefined;

    if (isNil(eId)) {
      newData = undefined;
    } else {
      const e = this.scene.entityManager.findEntityById(eId);
      if (isNil(e)) {
        newData = undefined;
      } else {
        newData = e.toJsonObject();
      }
    }

    const resData = replaceEqualDeep(this.oldData, newData);
    this.oldData = this.data;
    this.data = resData;
    this.emit();
  };
}
