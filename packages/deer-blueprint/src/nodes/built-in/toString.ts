import { BPNode } from '@/interface';
import { registerNodeTemplate } from '../registerNodeDefinition';
import { DEFAULT_NODE_WIDTH } from '@/constants';

export const toStringDefinition: BPNode = {
  name: 'toString',
  type: 'function',
  inputs: [
    {
      name: 'input',
      label: '',
      type: 'data',
      dataType: 'number',
      defaultValue: 0,
      value: 0,
    },
  ],
  outputs: [
    {
      name: 'output',
      label: '',
      type: 'data',
      dataType: 'string',
      defaultValue: '',
    },
  ],
  label: 'To String',
  category: 'built-in',
  id: '',
  position: { x: 0, y: 0 },
  width: DEFAULT_NODE_WIDTH,
  output: ({ getInputValue, getOutputExec }) => {
    return `${getInputValue('input')}.toString()`;
  },
};

registerNodeTemplate(toStringDefinition);
