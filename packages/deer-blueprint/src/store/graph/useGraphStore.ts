import { create } from 'zustand';
import { GraphStoreState } from './interface';
import { createConnectionSlice } from './createConnectionsSlice';
import { createNodesSlice } from './createNodesSlice';
import { immer } from 'zustand/middleware/immer';
import { createSharedSlice } from './createSharedSlice';

export const useGraphStore = create<GraphStoreState>()(
  immer((...a) => ({
    ...createConnectionSlice(...a),
    ...createNodesSlice(...a),
    ...createSharedSlice(...a),
  }))
);
