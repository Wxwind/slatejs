import {
  DEFAULT_NODE_WIDTH,
  NODE_NAME,
  NODE_PIN_HEIGHT,
  NODE_PIN_WIDTH,
  NODE_TITLE_FONT,
  NODE_TITLE_HEIGHT,
  ThemeStyle,
  getNodeHeight,
} from '@/constants';
import { BPNode, BPPinDefinition } from '@/interface';
import { isShiftKeyHold } from '@/util';
import Konva from 'konva';
import { Group, Rect, Text } from 'react-konva';
import { useGraphStore, useNodeDefinitionMapStore, useSelectedInfoStore } from '../store';
import { useRef } from 'react';
import { Pin } from './components';

interface BaseNodeProps {
  data: BPNode;
}

export function BaseNode(props: BaseNodeProps) {
  const { data } = props;

  const selectedNodes = useSelectedInfoStore((state) => state.selectedNodes);
  const addSelectedNodes = useSelectedInfoStore((state) => state.addSelectedNodes);
  const toggleSelectedNodes = useSelectedInfoStore((state) => state.toggleSelectedNodes);
  const moveNode = useGraphStore((state) => state.moveNode);

  const bpNodeDef = useNodeDefinitionMapStore().nodeDefinitionMap[data.name];

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

  const width = DEFAULT_NODE_WIDTH;
  const height = getNodeHeight(bpNodeDef);

  const calcInputPinPos = (pin: BPPinDefinition, index: number) => {
    const paddingLeft = 8;
    const top = NODE_TITLE_HEIGHT + index * NODE_PIN_HEIGHT;

    return { x: paddingLeft, y: top };
  };

  const calcOutputPinPos = (pin: BPPinDefinition, index: number) => {
    const paddingLeft = width - 8 - NODE_PIN_WIDTH;
    const top = NODE_TITLE_HEIGHT + index * NODE_PIN_HEIGHT;

    return { x: paddingLeft, y: top };
  };

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
      {bpNodeDef.inputs.map((pin, index) => (
        <Pin data={pin} position={calcInputPinPos(pin, index)} />
      ))}
      {bpNodeDef.outputs.map((pin, index) => (
        <Pin data={pin} position={calcOutputPinPos(pin, index)} />
      ))}
    </Group>
  );
}
