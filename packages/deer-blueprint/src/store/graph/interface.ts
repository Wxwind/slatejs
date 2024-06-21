import { ConnectionInfo, NodeInfo } from '@/interface';

export interface ConnectionsSlice {
  connections: ConnectionInfo[];
  startConnection: () => void;
  endConnection: () => void;
}

export interface NodesSlice {
  nodes: NodeInfo[];
  addNode: (node: NodeInfo) => void;
  deleteNode: (id: string) => void;
}

export type GraphStoreState = ConnectionsSlice & NodesSlice;
