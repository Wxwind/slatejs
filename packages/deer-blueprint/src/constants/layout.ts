import { BPNode } from '@/interface';
import { useGraphStore } from '..';

export const DEFAULT_NODE_WIDTH = 150;
export const NODE_PIN_HEIGHT = 24;
export const NODE_PIN_WIDTH = 12;
export const NODE_TITLE_FONT = 16;
export const NODE_TITLE_HEIGHT = 32;
const NODE_PIN_GAP = 4;
const NODE_PADDING_LR = 8;
const TITLE_PIN_GAP = 12;

export const calcNodeHeight = (nodeTemp: BPNode) => {
  const inputPin = nodeTemp.inputs;
  const outputPin = nodeTemp.outputs;

  const maxNum = Math.max(inputPin.length, outputPin.length);
  return NODE_TITLE_HEIGHT + TITLE_PIN_GAP + maxNum * NODE_PIN_HEIGHT;
};

export const calcInputPinPos = (nodeId: string, pinName: string) => {
  const node = useGraphStore.getState().nodeMap[nodeId];
  if (!node) return { x: 0, y: 0 };
  const pinIndex = node.inputs.findIndex((a) => a.name === pinName);
  if (pinIndex === -1) return { x: 0, y: 0 };
  const top = NODE_TITLE_HEIGHT + TITLE_PIN_GAP + pinIndex * (NODE_PIN_HEIGHT + NODE_PIN_GAP);

  const paddingLeft = NODE_PADDING_LR + NODE_PIN_WIDTH / 2;
  return { x: paddingLeft, y: top };
};

export const calcOutputPinPos = (nodeId: string, pinName: string) => {
  const node = useGraphStore.getState().nodeMap[nodeId];
  if (!node) return { x: 0, y: 0 };
  const pinIndex = node.outputs.findIndex((a) => a.name === pinName);
  if (pinIndex === -1) return { x: 0, y: 0 };
  const paddingLeft = node.width - NODE_PADDING_LR - NODE_PIN_WIDTH / 2;
  const top = NODE_TITLE_HEIGHT + TITLE_PIN_GAP + pinIndex * (NODE_PIN_HEIGHT + NODE_PIN_GAP);

  return { x: paddingLeft, y: top };
};
