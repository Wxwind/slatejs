import { BPNodeDefinition } from '@/interface';

export const DEFAULT_NODE_WIDTH = 150;
export const NODE_PIN_HEIGHT = 24;
export const NODE_PIN_WIDTH = 24;
export const NODE_TITLE_FONT = 16;
export const NODE_TITLE_HEIGHT = 32;

export const getNodeHeight = (nodedef: BPNodeDefinition) => {
  const inputPin = nodedef.inputs;
  const outputPin = nodedef.outputs;

  const maxNum = Math.max(inputPin.length, outputPin.length);
  return NODE_TITLE_HEIGHT + maxNum * NODE_PIN_HEIGHT;
};
