import { BPConnection, BPNode } from '@/interface';

export interface ConnectionsSlice {
  connections: BPConnection[];
  startConnection: () => void;
  endConnection: () => void;
  removeConnection: (id: string) => void;
}

export interface NodesSlice {
  nodeMap: Record<string, BPNode>;
  addNode: (node: BPNode) => void;
  removeNode: (id: string) => void;
  findNode: (id: string) => BPNode | undefined;
  moveNode: (id: string, deltaX: number, deltaY: number) => void;
  updateNode: (id: string, nodeInfo: BPNode) => void;
}

export interface GraphInfo {
  nodes: BPNode[];
  connections: BPConnection[];
}

export interface SharedSlice {
  save: () => GraphInfo;
  load: (data: GraphInfo) => void;
}

export type GraphStoreState = ConnectionsSlice & NodesSlice & SharedSlice;
