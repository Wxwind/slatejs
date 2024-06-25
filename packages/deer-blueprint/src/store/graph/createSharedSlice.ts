import { StateCreator } from 'zustand';
import { GraphStoreState, SharedSlice } from './interface';
import { BPNode } from '@/interface';

export const createSharedSlice: StateCreator<GraphStoreState, [['zustand/immer', never]], [], SharedSlice> = (
  set,
  get
) => ({
  save: () => {
    const { nodeMap: nodes, connections } = get();
    return { nodes: Object.values(nodes), connections };
  },
  load: (data) => {
    set({
      nodeMap: data.nodes.reduce(
        (acc, node) => {
          acc[node.id] = node;
          return acc;
        },
        {} as Record<string, BPNode>
      ),
      connections: data.connections,
    });
  },
});
