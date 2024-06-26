import { BPNodeDefinition } from '@/interface';

const nodeDefinitionMap: Record<string, BPNodeDefinition> = {};

export const registerNodeDefinition = (name: string, nodeDef: BPNodeDefinition) => {
  nodeDefinitionMap[name] = nodeDef;
};

export const getNodeDefinition = (name: string) => {
  return nodeDefinitionMap[name];
};
