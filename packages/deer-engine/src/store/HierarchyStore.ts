import { isNil, replaceEqualDeep } from '@/util';
import { DeerScene, EntityForHierarchy } from '..';
import { StoreBase } from './StoreBase';

export type HierarchyStoreData = EntityForHierarchy[];

export class HierarchyStore extends StoreBase<HierarchyStoreData> {
  constructor(public scene: DeerScene | undefined) {
    super();
  }

  private oldData: HierarchyStoreData | undefined;

  refreshData: () => void = () => {
    if (isNil(this.scene)) return;
    const newData = this.scene.entityManager.toTree();
    const resData = replaceEqualDeep(this.oldData, newData);
    this.oldData = this.data;
    this.data = resData;
    this.emit();
  };
}
