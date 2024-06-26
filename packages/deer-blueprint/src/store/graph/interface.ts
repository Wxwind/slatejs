import { BPConnection, BPNode } from '@/interface';
import Konva from 'konva';

export interface ConnectionsSlice {
  connections: BPConnection[];
  startConnection: () => void;
  endConnection: () => void;
  removeConnection: (id: string) => void;
}

export interface NodesSlice {
  nodeMap: Record<string, BPNode>;
  addNode: (name: string, position: Konva.Vector2d) => void;
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
