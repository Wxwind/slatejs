import { BPPinDefinition } from '@/interface';
import { FC } from 'react';
import { Group } from 'react-konva';
import { DataPin } from './DataPin';
import { ExecPin } from './ExecPin';
import Konva from 'konva';
import { useGraphStore } from '@/store';

interface PinProps {
  nodeId: string;
  data: BPPinDefinition;
  position: Konva.Vector2d;
  onConnectionStart: (e: Konva.KonvaEventObject<Event>) => void;
  onConnectionEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

export const Pin: FC<PinProps> = (props) => {
  const { nodeId, data, position, onConnectionStart, onConnectionEnd } = props;

  const isPinConnected = useGraphStore((state) => state.isPinConnected);

  const connected = isPinConnected(nodeId, data.name);

  let pinEl = undefined;
  switch (data.type) {
    case 'data':
      pinEl = (
        <DataPin
          data={data}
          connected={connected}
          onConnectionStart={onConnectionStart}
          onConnectionEnd={onConnectionEnd}
        />
      );
      break;
    case 'exec':
      pinEl = (
        <ExecPin
          data={data}
          connected={connected}
          onConnectionStart={onConnectionStart}
          onConnectionEnd={onConnectionEnd}
        />
      );
      break;
  }

  return (
    <Group x={position.x} y={position.y}>
      {pinEl}
    </Group>
  );
};
