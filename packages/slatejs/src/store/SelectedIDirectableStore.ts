import { Cutscene, IDirectable } from '@/core';
import { deepClone } from '@/util';
import { StoreBase } from './StoreBase';

export class SelectedIDirectableStore extends StoreBase<IDirectable> {
  constructor(private cutscene: Cutscene) {
    super();
  }

  selectResourceClip = (id: string) => {
    this.cutscene.selectObject(id);
    this.refreshData();
  };

  refreshData = () => {
    this.data = this.cutscene.selectedObject ? deepClone(this.cutscene.selectedObject) : undefined;
    this.emit();
  };
}
