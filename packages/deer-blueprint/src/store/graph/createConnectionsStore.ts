import { StateCreator } from 'zustand';
import { ConnectionsSlice, GraphStoreState } from './interface';

export const createConnectionStore: StateCreator<
  GraphStoreState,
  [['zustand/immer', never]],
  [['zustand/immer', never]],
  ConnectionsSlice
> = (set, get) => ({
  connections: [],
  startConnection: () => {},
  endConnection: () => {},
});
