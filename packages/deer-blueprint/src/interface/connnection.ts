export interface ConnectionInfo {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

export type PinDirection = 'in' | 'out';
export type PinType = 'exec' | 'data';
