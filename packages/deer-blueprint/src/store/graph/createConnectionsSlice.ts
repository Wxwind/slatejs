import { StateCreator } from 'zustand';
import { ConnectionsSlice, GraphStoreState } from './interface';
import { BPConnection } from '@/interface';
import { genUUID } from '@/util';

export const createConnectionSlice: StateCreator<GraphStoreState, [['zustand/immer', never]], [], ConnectionsSlice> = (
  set,
  get
) => ({
  connections: [],
  tempConnection: undefined,

  startConnecting: (fromNodeId, fromPinDirection, fromPin) => {
    if (get().tempConnection) return;
    set({ tempConnection: { fromNodeId, fromPinDirection, fromPin } });
  },

  cancelConnecting: () => {
    if (get().tempConnection) {
      set({ tempConnection: undefined });
    }
  },

  endConnecting: (toNodeId, toPinDirection, toPin) => {
    const { tempConnection, cancelConnecting } = get();
    console.log('end conn', tempConnection);
    if (!tempConnection) return;
    const { fromNodeId, fromPinDirection, fromPin } = tempConnection;
    if (fromNodeId === toNodeId) {
      console.warn(`same node`);
      cancelConnecting();
      return;
    }
    if (fromPinDirection === toPinDirection) {
      console.warn(`same direction`);
      cancelConnecting();
      return;
    }
    if (fromPin.type !== toPin.type) {
      console.warn(`type diff, from '${fromPin.type}' to '${toPin.type}'`);
      cancelConnecting();
      return;
    }
    if (fromPin.type == 'data' && toPin.type === 'data') {
      if (fromPin.dataType !== toPin.dataType) {
        console.warn(`dataType diff, from '${fromPin.dataType}' to '${toPin.dataType}'`);
        cancelConnecting();
        return;
      }
    }
    const conn: BPConnection = {
      id: genUUID('conn'),
      fromNodeId,
      fromPinName: fromPin.name,
      toNodeId,
      toPinName: toPin.name,
    };

    set((draft) => {
      console.log('connected');
      draft.connections.push(conn);
      draft.tempConnection = undefined;
    });
  },

  removeConnection: (id) => {
    set((draft) => {
      const index = draft.connections.findIndex((a) => a.id === id);
      index !== -1 && draft.connections.splice(index, 1);
    });
  },

  isPinConnected: (nodeId, pinName) => {
    const { connections, tempConnection } = get();

    return !!connections.find(
      (a) =>
        (a.fromNodeId === nodeId && a.fromPinName === pinName) ||
        (a.toNodeId === nodeId && a.toPinName === pinName) ||
        (tempConnection?.fromNodeId === nodeId && tempConnection?.fromPin.name === pinName)
    );
  },
});
