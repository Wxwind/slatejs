import { BPNode } from '@/interface';
import { useNodeTemplateMapStore } from '..';

export const registerNodeTemplate = (nodeTemp: BPNode) => {
  console.log('register node', nodeTemp.name);
  useNodeTemplateMapStore.getState().registerNodeTemplate(nodeTemp);
};
