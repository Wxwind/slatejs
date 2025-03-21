import { Stage } from 'react-konva';
import { SelectionLayer } from './SelectionLayer';
import { useGraphStore, useSelectedInfoStore, useStageStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { clearGraphEditorCursorStyle, isNil, setGraphEditorCursorStyle } from '@/util';
import Konva from 'konva';
import { useKeyPress } from 'ahooks';
import { ConnectionLayer } from './ConnectionLayer';
import { NodeLayer } from './NodeLayer';
import { GRAPH_EIDTOR_ID } from '@/constants';
import { GraphEditorContextMenu } from './GraphEditorContextMenu';
import { globalEventEmitter } from '@/event';
import { ContextMenuType } from '@/event/globalEventMap';
import { KonvaEventObject } from 'konva/lib/Node';

export function GraphEditor() {
  const { width, height, position, scale, setSize, setPosition, setScale, viewportToWorldPosition } = useStageStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [isDraggable, setIsDraggable] = useState(false);

  const clearSelection = useSelectedInfoStore((state) => state.clearSelection);
  const cancelConnecting = useGraphStore((state) => state.cancelConnecting);

  const getPointerWorldPosition = useStageStore((state) => state.getPointerWorldPosition);

  const handleUpdateStagePos = (e: Konva.KonvaEventObject<DragEvent>) => {
    setPosition(e.target.position());
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (isNil(stage)) return;

    const viewPos = stage.getPointerPosition() || { x: 0, y: 0 };
    const worldPos = viewportToWorldPosition(viewPos);

    const dir = e.evt.deltaY > 0 ? 1 : -1;
    const oldScale = scale.x;
    const newScale = dir > 0 ? oldScale * 1.05 : oldScale / 1.05;
    setScale(newScale);

    const newPos = {
      x: viewPos.x - worldPos.x * newScale,
      y: viewPos.y - worldPos.y * newScale,
    };
    setPosition(newPos);
  };

  const handleClick = () => {
    clearSelection();
    if (isNil(stageRef.current)) return;
    globalEventEmitter.emit('stageClick', getPointerWorldPosition(stageRef.current));
  };

  const handleMouseUp = () => {
    cancelConnecting();
  };

  const handleContextMenu = (evt: KonvaEventObject<PointerEvent>) => {
    if (isNil(stageRef.current)) return;
    globalEventEmitter.emit('contextmenu', ContextMenuType.CREATE_NODE, {
      position: getPointerWorldPosition(stageRef.current),
    });
  };

  const handlePointerMove = (evt: KonvaEventObject<PointerEvent>) => {
    if (isNil(stageRef.current)) return;
    globalEventEmitter.emit('stageMove', getPointerWorldPosition(stageRef.current));
  };

  useEffect(() => {
    const container = containerRef.current;
    if (isNil(container)) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize(width, height);
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useKeyPress(
    (event) => event.key === ' ',
    (event) => {
      if (event.type === 'keydown') {
        setIsDraggable(true);
        setGraphEditorCursorStyle('drag');
      } else if (event.type === 'keyup') {
        setIsDraggable(false);
        clearGraphEditorCursorStyle();
      }
    },
    { events: ['keydown', 'keyup'] }
  );

  return (
    <GraphEditorContextMenu>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        <Stage
          id={GRAPH_EIDTOR_ID}
          ref={stageRef}
          width={width}
          height={height}
          x={position.x}
          y={position.y}
          scale={scale}
          draggable={isDraggable}
          onWheel={handleWheel}
          onDragMove={handleUpdateStagePos}
          onDragEnd={handleUpdateStagePos}
          onClick={handleClick}
          onMouseUp={handleMouseUp}
          onMouseMove={handlePointerMove}
          onContextMenu={handleContextMenu}
        >
          <NodeLayer />
          <ConnectionLayer />
          <SelectionLayer />
        </Stage>
      </div>
    </GraphEditorContextMenu>
  );
}
