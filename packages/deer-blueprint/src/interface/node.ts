export interface NodeDefinition {
  name: string;
  inputs: NodeDefinition[];
  outputs: NodeDefinition[];
}

export interface NodeInfo {
  id: string;
}
