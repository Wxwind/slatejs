import { create } from 'zustand';
import { GraphStoreState } from './interface';
import { createConnectionStore } from './createConnectionsStore';
import { createNodesStore } from './createNodesStore';
import { immer } from 'zustand/middleware/immer';

export const useGraphStore = create<GraphStoreState>()(
  immer((...a) => ({
    ...createConnectionStore(...a),
    ...createNodesStore(...a),
  }))
);
