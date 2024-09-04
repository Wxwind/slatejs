import { GridHelper } from 'three';
import { ComponentBase } from '../ComponentBase';
import { GridHelperComponentJson } from '../type';
import { egclass } from '../../decorator';
import { DeerScene } from '../../DeerScene';

@egclass()
export class GridHelperComponent extends ComponentBase<'GridHelperComponent'> {
  type = 'GridHelperComponent' as const;

  public get isCanBeRemoved(): boolean {
    return false;
  }

  private gridHelper: GridHelper | undefined;

  onAwake = () => {
    const deerScene = this.scene;
    if (deerScene.mode !== 'editor') return;
    const gridHelper = new GridHelper(1000, 200, 0x2c2c2c, 0x888888);
    gridHelper.position.y = -1;
    deerScene.sceneObject.add(gridHelper);
    this.gridHelper = gridHelper;
  };

  update: (dt: number) => void = () => {};

  onEnabled: () => void = () => {};

  onDisabled: () => void = () => {};

  onDestroy: () => void = () => {
    this.gridHelper?.dispose();
  };

  updateByJson: (data: GridHelperComponentJson) => void = (data) => {
    this.signals.componentUpdated.emit();
  };

  onSerialize: () => GridHelperComponentJson = () => {
    return {};
  };

  onDeserialize: (data: GridHelperComponentJson) => void = (data) => {};
}
