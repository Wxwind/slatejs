import { StateCreator } from 'zustand';
import { GraphStoreState, NodesSlice } from './interface';

export const createNodesSlice: StateCreator<GraphStoreState, [['zustand/immer', never]], [], NodesSlice> = (
  set,
  get
) => ({
  nodeMap: {},
  addNode: () => {},
  removeNode: (id) => {
    // delete connection
    const { connections } = get();
    delete get().nodeMap.id;
  },
  findNode: (id) => {
    return get().nodeMap[id];
  },
});
