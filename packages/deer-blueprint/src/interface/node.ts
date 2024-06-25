import Konva from 'konva';

export interface BPNodeDefinition {
  name: string;
  inputs: BPNodeDefinition[];
  outputs: BPNodeDefinition[];
}

export interface BPNode {
  id: string;
  name: string;
  position: Konva.Vector2d;
  data?: Record<string, unknown>;
}

export type BPConnectingPinDirection = 'in' | 'out';
export type BPPinType = 'exec' | 'data';

export interface BPNodePinDefinition {
  name: string;
  type: BPPinType;
  position: Konva.Vector2d;
}
