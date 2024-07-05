import { BPNode } from '@/interface';
import { buildExecNodePin } from '@/util/nodeBuilder';
import { registerNodeTemplate } from '../registerNodeDefinition';
import { DEFAULT_NODE_WIDTH } from '@/constants';

export const forLoopDefinition: BPNode = {
  name: 'forLoop',
  type: 'function',
  inputs: [
    buildExecNodePin('in'),
    {
      name: 'firstIndex',
      label: 'First Index',
      type: 'data',
      dataType: 'number',
      defaultValue: 0,
      value: 0,
    },
    {
      name: 'lastIndex',
      label: 'Last Index',
      type: 'data',
      dataType: 'number',
      defaultValue: 0,
      value: 0,
    },
  ],
  outputs: [
    {
      name: 'loopBody',
      label: 'Loop Body',
      type: 'exec',
    },
    {
      name: 'index',
      label: 'Index',
      type: 'data',
      dataType: 'number',
      defaultValue: 0,
    },
    {
      name: 'completed',
      label: 'Completed',
      type: 'exec',
    },
  ],
  label: 'For Loop',
  category: 'built-in',
  id: '',
  position: { x: 0, y: 0 },
  width: DEFAULT_NODE_WIDTH,
  output: ({ getInputValue, getOutputExec, getOutputVarName }) => {
    const index = getOutputVarName('index');
    return `for(let ${index} = ${getInputValue('firstIndex')}; ${index} <= ${getInputValue('lastIndex')}; ${index}++){
    ${getOutputExec('loopBody')}
    }
    ${getOutputExec('completed')}`;
  },
};

registerNodeTemplate(forLoopDefinition);
