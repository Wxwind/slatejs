import { BPConnection, BPNode, BPPinDefinition, BPPinDirection, BPPinType } from '@/interface';

export interface TempConnection {
  fromNodeId: string;
  fromPinDirection: BPPinDirection;
  fromPin: BPPinDefinition;
}

export interface ConnectionsSlice {
  connections: BPConnection[];
  tempConnection: TempConnection | undefined;
  startConnecting: (fromNodeId: string, fromPinDirection: BPPinDirection, fromPin: BPPinDefinition) => void;
  cancelConnecting: () => void;
  endConnecting: (toNodeId: string, toPinDirection: BPPinDirection, toPin: BPPinDefinition) => void;
  removeConnection: (id: string) => void;
  isPinConnected: (nodeId: string, pinName: string) => boolean;
}

export interface NodesSlice {
  nodeMap: Record<string, BPNode>;
  addNode: (node: BPNode) => void;
  removeNode: (id: string) => void;
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
