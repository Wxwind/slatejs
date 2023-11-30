import { HierarchyStore, SelectedEntityInfoStore, SelectedEntityStore } from '@/store';
import { DeerScene } from './DeerScene';

export class DeerStore {
  hierarchyStore: HierarchyStore;
  selectedEntityIdStore: SelectedEntityStore;
  selectedEntityInfoStore: SelectedEntityInfoStore;

  constructor(scene: DeerScene | undefined) {
    this.hierarchyStore = new HierarchyStore(scene);
    this.selectedEntityIdStore = new SelectedEntityStore(scene);
    this.selectedEntityInfoStore = new SelectedEntityInfoStore(scene);
  }

  setScene = (scene: DeerScene | undefined) => {
    this.hierarchyStore.scene = scene;
    this.selectedEntityIdStore.scene = scene;
    this.selectedEntityInfoStore.scene = scene;
  };
}
