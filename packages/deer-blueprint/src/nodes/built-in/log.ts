import { BPNode } from '@/interface';
import { buildExecNodePin } from '@/util/nodeBuilder';
import { registerNodeTemplate } from '../registerNodeDefinition';
import { DEFAULT_NODE_WIDTH } from '@/constants';

export const logDefinition: BPNode = {
  name: 'log',
  type: 'function',
  inputs: [
    buildExecNodePin('in'),
    {
      name: 'message',
      label: 'Message',
      type: 'data',
      dataType: 'string',
      defaultValue: '',
      value: '',
    },
  ],
  outputs: [buildExecNodePin('out')],
  label: 'Log',
  category: 'built-in',
  id: '',
  position: { x: 0, y: 0 },
  width: DEFAULT_NODE_WIDTH,
  output: ({ getInputValue, getOutputExec }) => {
    return `console.log(${getInputValue('message')})`;
  },
};

registerNodeTemplate(logDefinition);
