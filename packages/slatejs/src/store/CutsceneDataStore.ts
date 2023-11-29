import { Cutscene, CutsceneData } from '../core';
import { deepClone, replaceEqualDeep } from '../util';
import { StoreBase } from './StoreBase';

export class CutsceneDataStore extends StoreBase<CutsceneData> {
  constructor(private cutscene: Cutscene) {
    super();
  }

  private oldData: CutsceneData | undefined;

  refreshData = () => {
    const newData = deepClone(this.cutscene.director.toJsonObject());
    const resData = replaceEqualDeep(this.oldData, newData);
    this.oldData = this.data;
    this.data = resData;
    this.emit();
  };
}
