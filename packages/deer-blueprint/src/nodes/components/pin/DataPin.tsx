import { NODE_PIN_WIDTH } from '@/constants';
import { BPDataPinDefinition } from '@/interface';
import { Checkbox, Input, InputNumber } from '@arco-design/web-react';
import Konva from 'konva';
import { useState } from 'react';
import { Circle, Group, Line } from 'react-konva';
import { Html } from 'react-konva-utils';

const triangleSize = 3;
const trianglePaddingLeft = 2;

interface DataPinProps {
  data: BPDataPinDefinition;
  connected: boolean;
  onConnectionStart: (e: Konva.KonvaEventObject<Event>) => void;
  onConnectionEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

export function DataPin(props: DataPinProps) {
  const { data, connected, onConnectionStart, onConnectionEnd } = props;
  const [strokeWidth, setStrokeWidth] = useState(2);

  let pinEl = undefined;
  switch (data.dataType) {
    case 'string':
      pinEl = (
        <Html>
          <Input size="mini" defaultValue={data.defaultValue} value={data.value} style={{ width: 80 }} />
        </Html>
      );
      break;
    case 'number':
      pinEl = (
        <Html>
          <InputNumber size="mini" defaultValue={data.defaultValue} value={data.value} style={{ width: 80 }} />
        </Html>
      );
      break;
    case 'boolean':
      pinEl = (
        <Html>
          <Checkbox defaultChecked={data.defaultValue} checked={data.value} />
        </Html>
      );
      break;
  }

  const radius = NODE_PIN_WIDTH / 2;

  return (
    <>
      <Circle
        radius={radius}
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
      <Line
        x={radius + triangleSize + trianglePaddingLeft}
        y={0}
        points={[0, 0, -triangleSize, -triangleSize, -triangleSize, triangleSize]}
        closed={true}
        fill="white"
      />
      <Group x={radius + triangleSize + trianglePaddingLeft + 4} y={0}>
        {pinEl}
      </Group>
    </>
  );
}
