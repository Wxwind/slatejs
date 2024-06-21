import { StateCreator } from 'zustand';
import { ConnectionsSlice, GraphStoreState } from './interface';

export const createConnectionSlice: StateCreator<GraphStoreState, [['zustand/immer', never]], [], ConnectionsSlice> = (
  set,
  get
) => ({
  connections: [],
  startConnection: () => {},
  endConnection: () => {},
  removeConnection: (id) => {},
});
