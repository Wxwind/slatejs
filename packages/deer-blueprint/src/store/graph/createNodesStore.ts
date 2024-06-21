import { StateCreator } from 'zustand';
import { GraphStoreState, NodesSlice } from './interface';

export const createNodesStore: StateCreator<
  GraphStoreState,
  [['zustand/immer', never]],
  [['zustand/immer', never]],
  NodesSlice
> = (set, get) => ({
  nodes: [],
  addNode: () => {},
  deleteNode: () => {},
});
