import { isNil } from '@/util';
import { DeerScene } from '..';
import { StoreBase } from './StoreBase';

export type SelectedEntityStoreData = string | undefined;

export class SelectedEntityStore extends StoreBase<SelectedEntityStoreData> {
  constructor(public scene: DeerScene | undefined) {
    super();
  }

  refreshData: () => void = () => {
    if (isNil(this.scene)) return;
    this.data = this.scene.entityManager.selectedEntityId;
    this.emit();
  };
}
