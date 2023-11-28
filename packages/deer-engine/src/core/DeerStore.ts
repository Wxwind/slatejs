import { HierarchyStore, SelectedEntityStore } from '@/store';
import { DeerScene } from './DeerScene';

export class DeerStore {
  selectedEntityIdStore: SelectedEntityStore;
  hierarchyStore: HierarchyStore;

  constructor(scene: DeerScene | undefined) {
    this.hierarchyStore = new HierarchyStore(scene);
    this.selectedEntityIdStore = new SelectedEntityStore(scene);
  }

  setScene = (scene: DeerScene | undefined) => {
    this.hierarchyStore.scene = scene;
    this.selectedEntityIdStore.scene = scene;
  };
}
