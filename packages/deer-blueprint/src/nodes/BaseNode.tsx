import { NODE_NAME } from '@/constants/graphEditor';
import { BPNode } from '@/interface';
import { isShiftKeyHold } from '@/util';
import Konva from 'konva';
import { Group, Rect } from 'react-konva';
import { useGraphStore, useSelectedInfoStore } from '..';
import { useRef } from 'react';

interface BaseNodeProps {
  nodeInfo: BPNode;
}

export function BaseNode(props: BaseNodeProps) {
  const { nodeInfo } = props;

  const selectedNodes = useSelectedInfoStore((state) => state.selectedNodes);
  const addSelectedNodes = useSelectedInfoStore((state) => state.addSelectedNodes);
  const toggleSelectedNodes = useSelectedInfoStore((state) => state.toggleSelectedNodes);
  const moveNode = useGraphStore((state) => state.moveNode);

  const prevPos = useRef<Konva.Vector2d>();

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;

    if (isShiftKeyHold(e.evt)) {
      toggleSelectedNodes([e.target.id()]);
    } else {
      console.log('click e.target.id', e.target.id());
      addSelectedNodes([e.target.id()], true);
    }
  };

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    prevPos.current = e.target.position();

    if (!selectedNodes.includes(e.target.id())) {
      addSelectedNodes([e.target.id()], true);
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

  return (
    <Group
      id={nodeInfo.id}
      name={NODE_NAME}
      x={nodeInfo.position.x}
      y={nodeInfo.position.y}
      draggable={true}
      onClick={handleClick}
      onDragStart={handleDragStart}
      onDragMove={moveSelectedNodes}
      onDragEnd={moveSelectedNodes}
    >
      <Rect cornerRadius={4} shadowColor="black" shadowOpacity={0.8} shadowBlur={8} />
    </Group>
  );
}
