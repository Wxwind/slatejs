import { NODE_PIN_WIDTH } from '@/constants';
import { BPExecPinDefinition } from '@/interface';
import Konva from 'konva';
import { useState } from 'react';
import { Line } from 'react-konva';

interface ExecPinProps {
  data: BPExecPinDefinition;
  connected: boolean;
  onConnectionStart: (e: Konva.KonvaEventObject<Event>) => void;
  onConnectionEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

export function ExecPin(props: ExecPinProps) {
  const { data, connected, onConnectionStart, onConnectionEnd } = props;
  const [strokeWidth, setStrokeWidth] = useState(2);

  const pinSize = NODE_PIN_WIDTH / 2;
  return (
    <Line
      closed
      points={[pinSize, 0, 0, -pinSize, -pinSize, -pinSize, -pinSize, pinSize, 0, pinSize]}
      stroke="white"
      strokeWidth={strokeWidth}
      fill={connected ? 'white' : ''}
      onPointerEnter={(e) => {
        setStrokeWidth(3);
      }}
      onPointerLeave={(e) => {
        setStrokeWidth(2);
      }}
      // pointerdown/up can't cancel bubble of node's dragstart/end
      onMouseDown={onConnectionStart}
      onMouseUp={onConnectionEnd}
    />
  );
}
