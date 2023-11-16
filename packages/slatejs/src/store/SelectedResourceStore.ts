import { CutScene, IDirectable } from '@/core';
import { deepClone } from '@/utils';
import { StoreBase } from './StoreBase';

export class SelectedResouceStore extends StoreBase<IDirectable> {
  constructor(private cutScene: CutScene) {
    super();
  }

  selectResourceClip = (id: string) => {
    this.cutScene.selectObject(id);
    this.refreshData();
  };

  protected refreshData = () => {
    this.data = this.cutScene.selectedObject ? deepClone(this.cutScene.selectedObject) : undefined;
    this.emit();
  };
}
