import { BPDataPinDefinitionMap, BPNode } from '@/interface';
import { registerNodeTemplate } from '../registerNodeDefinition';
import { DEFAULT_NODE_WIDTH } from '@/constants';

export const AddDefinition: BPNode = {
  id: '-1',
  position: { x: 0, y: 0 },
  width: DEFAULT_NODE_WIDTH,
  name: 'add',
  type: 'function',
  inputs: [
    {
      name: 'input1',
      type: 'data',
      dataType: 'number',
      defaultValue: 0,
      value: 0,
    },
    {
      name: 'input2',
      type: 'data',
      dataType: 'number',
      defaultValue: 0,
      value: 0,
    },
  ],
  outputs: [
    {
      name: 'output',
      type: 'data',
      dataType: 'number',
      defaultValue: 0,
      value: 0,
    },
  ],
  label: 'Add',
  category: 'logic',
  output: ({ getInputValue: getInput, getOutputExec: getOutput }) => {
    return `${getInput('input1')} + ${getOutput('input2')}`;
  },
};

registerNodeTemplate(AddDefinition);
