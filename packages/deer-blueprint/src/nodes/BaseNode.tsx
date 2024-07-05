import {
  DEFAULT_NODE_WIDTH,
  NODE_NAME,
  NODE_TITLE_FONT,
  NODE_TITLE_HEIGHT,
  ThemeStyle,
  calcOutputPinPos,
  calcNodeHeight,
} from '@/constants';
import { BPNode } from '@/interface';
import { isShiftKeyHold } from '@/util';
import Konva from 'konva';
import { Group, Rect, Text } from 'react-konva';
import { useGraphStore, useSelectedInfoStore } from '../store';
import { useRef } from 'react';
import { Pin } from './components';
import { calcInputPinPos } from '@/constants';

interface BaseNodeProps {
  data: BPNode;
}

export function BaseNode(props: BaseNodeProps) {
  const { data } = props;

  const selectedNodes = useSelectedInfoStore((state) => state.selectedNodes);
  const addSelectedNodes = useSelectedInfoStore((state) => state.addSelectedNodes);
  const toggleSelectedNodes = useSelectedInfoStore((state) => state.toggleSelectedNodes);
  const moveNode = useGraphStore((state) => state.moveNode);
  const startConnecting = useGraphStore((state) => state.startConnecting);
  const endConnecting = useGraphStore((state) => state.endConnecting);

  const prevPos = useRef<Konva.Vector2d>();
  const isSelected = selectedNodes.includes(data.id);

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;

    if (isShiftKeyHold(e.evt)) {
      toggleSelectedNodes([data.id]);
    } else {
      addSelectedNodes([data.id], true);
    }
  };

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    prevPos.current = e.target.position();

    if (!isSelected) {
      addSelectedNodes([data.id], true);
    }
  };

  const moveSelectedNodes = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;

    if (!prevPos.current) return;

    const nowPos = e.target.position();
    const dx = nowPos.x - prevPos.current.x;
    const dy = nowPos.y - prevPos.current.y;

    selectedNodes.forEach((nodeId) => {
      moveNode(nodeId, dx, dy);
    });
    prevPos.current = nowPos;
  };

  const width = data.width;
  const height = calcNodeHeight(data);

  return (
    <Group
      id={data.id}
      name={NODE_NAME}
      x={data.position.x}
      y={data.position.y}
      draggable={true}
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragMove={moveSelectedNodes}
      onDragEnd={moveSelectedNodes}
    >
      <Rect
        width={width}
        height={height}
        opacity={0.8}
        stroke="white"
        strokeWidth={isSelected ? 4 : 0}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: width, y: height }}
        fillLinearGradientColorStops={[0, ThemeStyle.node.bgGradient.start, 1, ThemeStyle.node.bgGradient.end]}
        cornerRadius={4}
        shadowColor="black"
        shadowOpacity={0.8}
        shadowBlur={8}
      />
      <Text
        x={8}
        y={0}
        width={width}
        height={NODE_TITLE_HEIGHT}
        text={data.name}
        align="left"
        verticalAlign="middle"
        fontSize={NODE_TITLE_FONT}
        fill="white"
      />
      {data.inputs.map((pin) => (
        <Pin
          key={pin.name}
          data={pin}
          nodeId={data.id}
          position={calcInputPinPos(data.id, pin.name)}
          onConnectionStart={(e) => {
            e.cancelBubble = true;
            startConnecting(data.id, 'in', pin);
          }}
          onConnectionEnd={(e) => {
            e.cancelBubble = true;
            endConnecting(data.id, 'in', pin);
          }}
        />
      ))}
      {data.outputs.map((pin) => (
        <Pin
          key={pin.name}
          data={pin}
          nodeId={data.id}
          position={calcOutputPinPos(data.id, pin.name)}
          onConnectionStart={(e) => {
            e.cancelBubble = true;
            startConnecting(data.id, 'out', pin);
          }}
          onConnectionEnd={(e) => {
            e.cancelBubble = true;
            endConnecting(data.id, 'out', pin);
          }}
        />
      ))}
    </Group>
  );
}
