import { NODE_PIN_EXEC_INPUT, NODE_PIN_EXEC_OUTPUT } from '@/constants';
import { BPNodePinDefinition, BPPinDirection } from '@/interface';

export const buildExecNodePin: (dir: BPPinDirection) => BPNodePinDefinition = (dir) => ({
  type: 'exec',
  name: dir === 'in' ? NODE_PIN_EXEC_INPUT : NODE_PIN_EXEC_OUTPUT,
});
