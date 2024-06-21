import { ConnectionInfo, NodeInfo } from '@/interface';

export interface ConnectionsSlice {
  connections: ConnectionInfo[];
  startConnection: () => void;
  endConnection: () => void;
  removeConnection: (id: string) => void;
}

export interface NodesSlice {
  nodeMap: Record<string, NodeInfo>;
  addNode: (node: NodeInfo) => void;
  removeNode: (id: string) => void;
  findNode: (id: string) => void;
}

export interface GraphInfo {
  nodes: NodeInfo[];
  connections: ConnectionInfo[];
}

export interface SharedSlice {
  save: () => GraphInfo;
  load: (data: GraphInfo) => void;
}

export type GraphStoreState = ConnectionsSlice & NodesSlice & SharedSlice;
