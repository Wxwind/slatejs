import { HierarchyStore } from '@/store';
import { DeerScene } from './DeerScene';

export class DeerStore {
  hierarchyStore: HierarchyStore;

  constructor(scene: DeerScene | undefined) {
    this.hierarchyStore = new HierarchyStore(scene);
  }

  setScene = (scene: DeerScene | undefined) => {
    this.hierarchyStore.scene = scene;
  };
}
