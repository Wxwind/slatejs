import { StateCreator } from 'zustand';
import { GraphStoreState, NodesSlice } from './interface';

export const createNodesSlice: StateCreator<GraphStoreState, [['zustand/immer', never]], [], NodesSlice> = (
  set,
  get
) => ({
  nodeMap: {},
  addNode: (node) => {
    set((draft) => {
      draft.nodeMap[node.id] = node;
    });
  },
  removeNode: (id) => {
    const { connections, removeConnection } = get();

    set((draft) => {
      const conns = connections.filter((conn) => conn.fromNodeId === id || conn.toNodeId === id);
      conns.forEach((conn) => {
        removeConnection(conn.id);
      });
      delete draft.nodeMap[id];
    });
  },
  findNode: (id) => {
    return get().nodeMap[id];
  },
  moveNode: (id, dx, dy) => {
    const node = get().findNode(id);
    if (!node) return;

    set((draft) => {
      draft.nodeMap[id].position = {
        x: node.position.x + dx,
        y: node.position.y + dy,
      };
    });
  },
  updateNode: (id, data) => {
    const node = get().findNode(id);
    if (!node) return;

    set((draft) => {
      draft.nodeMap[id] = {
        ...draft.nodeMap[id],
        ...data,
      };
    });
  },
});
