import { BPPinDefinition } from '@/interface';
import { Circle } from 'react-konva';

interface DataPinProps {
  data: BPPinDefinition;
}

export function DataPin(props: DataPinProps) {
  const { data } = props;

  return <Circle radius={6} stroke="white" strokeWidth={2} />;
}
