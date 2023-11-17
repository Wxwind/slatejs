import { Cutscene, IDirectable } from '@/core';
import { deepClone } from '@/utils';
import { StoreBase } from './StoreBase';

export class SelectedResouceStore extends StoreBase<IDirectable> {
  constructor(private cutscene: Cutscene) {
    super();
  }

  selectResourceClip = (id: string) => {
    this.cutscene.selectObject(id);
    this.refreshData();
  };

  protected refreshData = () => {
    this.data = this.cutscene.selectedObject ? deepClone(this.cutscene.selectedObject) : undefined;
    this.emit();
  };
}
