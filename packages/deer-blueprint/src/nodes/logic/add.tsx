import { BPNodeDefinition } from '@/interface';
import { registerNodeDefinition } from '../registerNodeDefinition';

export const AddDefinition: BPNodeDefinition = {
  name: 'add',
  type: 'function',
  inputs: [
    {
      name: 'input1',
      type: 'exec',
    },
    {
      name: 'input2',
      type: 'exec',
    },
  ],
  outputs: [
    {
      name: 'output',
      type: 'exec',
    },
  ],
  label: 'Add',
  category: 'logic',
};

registerNodeDefinition(AddDefinition.name, AddDefinition);
