import { isNil, replaceEqualDeep } from '@/util';
import { DeerScene } from '..';
import { StoreBase } from './StoreBase';
import { ComponentInfo } from '@/core/component/type';

export type SelectedEntityInfoStoreData = {
  id: string;
  name: string;
  components: ComponentInfo[];
};

export class SelectedEntityInfoStore extends StoreBase<SelectedEntityInfoStoreData> {
  private oldData: SelectedEntityInfoStoreData | undefined;

  constructor(public scene: DeerScene | undefined) {
    super();
  }

  refreshData: () => void = () => {
    if (isNil(this.scene)) return;
    const eId = this.scene.entityManager.selectedEntityId;
    let newData: SelectedEntityInfoStoreData | undefined;

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
