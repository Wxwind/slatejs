import { BPNodeDefinition } from '@/interface';
import { buildExecNodePin } from '@/util/nodeBuilder';

export const branchDefinition: BPNodeDefinition = {
  name: 'if',
  type: 'function',
  inputs: [
    buildExecNodePin('in'),
    {
      name: 'condition',
      label: 'Condition',
      type: 'data',
      dataType: 'boolean',
    },
  ],
  outputs: [
    buildExecNodePin('out'),
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
  label: '',
  category: '',
};
