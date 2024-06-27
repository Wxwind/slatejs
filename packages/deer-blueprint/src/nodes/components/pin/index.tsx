import { BPPinDefinition } from '@/interface';
import { FC } from 'react';
import { Group } from 'react-konva';
import { DataPin } from './DataPin';
import { ExecPin } from './ExecPin';
import Konva from 'konva';

interface PinProps {
  data: BPPinDefinition;
  position: Konva.Vector2d;
}

export const Pin: FC<PinProps> = (props) => {
  const { data, position } = props;

  let pinEl = undefined;
  switch (data.type) {
    case 'data':
      pinEl = <DataPin data={data} />;
      break;
    case 'exec':
      pinEl = <ExecPin data={data} />;
      break;
  }

  return (
    <Group x={position.x} y={position.y}>
      {pinEl}
    </Group>
  );
};
