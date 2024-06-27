import { BPPinDefinition } from '@/interface';
import { Line } from 'react-konva';

interface ExecPinProps {
  data: BPPinDefinition;
}

const PIN_SIZE = 6;

export function ExecPin(props: ExecPinProps) {
  const { data } = props;

  return <Line points={[PIN_SIZE, 0, 0, -PIN_SIZE, -PIN_SIZE, -PIN_SIZE, -PIN_SIZE, PIN_SIZE, 0, PIN_SIZE]} />;
}
