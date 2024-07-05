import { NODE_PIN_STANDARD_EXEC_INPUT, NODE_PIN_STANDARD_EXEC_OUTPUT } from '@/constants';
import { BPPinDefinition, BPPinDirection } from '@/interface';

export const buildExecNodePin: (dir: BPPinDirection) => BPPinDefinition = (dir) => ({
  type: 'exec',
  name: dir === 'in' ? NODE_PIN_STANDARD_EXEC_INPUT : NODE_PIN_STANDARD_EXEC_OUTPUT,
});
