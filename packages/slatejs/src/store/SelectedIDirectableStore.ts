import { Cutscene, IDirectable } from '@/core';
import { deepClone } from '@/util';
import { StoreBase } from './StoreBase';

export class SelectedIDirectableStore extends StoreBase<IDirectable> {
  constructor(private cutscene: Cutscene) {
    super();
  }

  refreshData = () => {
    this.data = this.cutscene.selectedObject ? deepClone(this.cutscene.selectedObject) : undefined;
    this.emit();
  };
}
