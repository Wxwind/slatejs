import { BPNodeDefinition } from '@/interface';
import { useNodeDefinitionMapStore } from '..';

export const registerNodeDefinition = (nodeDef: BPNodeDefinition) => {
  useNodeDefinitionMapStore.getState().registerNodeDefinition(nodeDef);
};
