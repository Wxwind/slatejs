import { BPNode } from '@/interface';
import { buildExecNodePin } from '@/util/nodeBuilder';
import { registerNodeTemplate } from '../registerNodeDefinition';
import { DEFAULT_NODE_WIDTH } from '@/constants';

export const branchDefinition: BPNode = {
  name: 'branch',
  type: 'function',
  inputs: [
    buildExecNodePin('in'),
    {
      name: 'condition',
      label: 'Condition',
      type: 'data',
      dataType: 'boolean',
      defaultValue: false,
      value: false,
    },
  ],
  outputs: [
    {
      name: 'true',
      label: 'True',
      type: 'exec',
    },
    {
      name: 'false',
      label: 'False',
      type: 'exec',
    },
  ],
  label: 'Branch',
  category: 'built-in',
  id: '',
  position: { x: 0, y: 0 },
  width: DEFAULT_NODE_WIDTH,
  output: ({ getInputValue, getOutputExec }) => {
    return `if(${getInputValue('condition')}{
    ${getInputValue('true')}
    }else{
    ${getOutputExec('false')}
    }`;
  },
};

registerNodeTemplate(branchDefinition);
