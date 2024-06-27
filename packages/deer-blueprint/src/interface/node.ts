import Konva from 'konva';

export type BPNodeType = 'begin' | 'end' | 'function';

export interface BPNodeDefinition {
  name: string;
  type: BPNodeType;
  inputs: BPPinDefinition[];
  outputs: BPPinDefinition[];

  label: string;
  category: string;
}

export interface BPNode {
  id: string;
  name: string;
  position: Konva.Vector2d;
  data?: Record<string, unknown>;
}

export type BPPinDirection = 'in' | 'out';
export type BPPinType = 'exec' | 'data';
export type BPPinDataType = 'number' | 'string' | 'boolean';

export type BPPinDefinition =
  | {
      name: string;
      label?: string;
      type: 'exec';
    }
  | { name: string; label?: string; type: 'data'; dataType: BPPinDataType };
