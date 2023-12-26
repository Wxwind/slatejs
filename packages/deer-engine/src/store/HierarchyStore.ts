import { isNil, replaceEqualDeep } from '@/util';
import { DeerScene } from '../core';
import { StoreBase } from './StoreBase';
import { EntityForHierarchy } from './type';

export type HierarchyStoreData = EntityForHierarchy[];

export class HierarchyStore extends StoreBase<HierarchyStoreData> {
  private oldData: HierarchyStoreData | undefined;

  constructor(public scene: DeerScene | undefined) {
    super();
  }

  refreshData: () => void = () => {
    if (isNil(this.scene)) return;
    const newData = this.scene.entityManager.toTree();
    const resData = replaceEqualDeep(this.oldData, newData);
    this.oldData = this.data;
    this.data = resData;
    this.emit();
  };
}
