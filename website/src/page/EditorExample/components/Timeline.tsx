import { FC, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { CutsceneEditorPanel, CutsceneEditorPanelMemo } from '@/module/slatejs';

export const Timeline: FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>();

  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: DraggableEvent, ui: DraggableData) => {
    const { x, y } = pos || { x: 0, y: 0 };
    const newPos = {
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    };
    setPos(newPos);
  };

  const resetPos = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      handle=".controls"
      position={pos}
      onDrag={handleDrag}
      defaultPosition={{ x: 0, y: 0 }}
    >
      <div ref={nodeRef} className="w-3/4 h-80 absolute bottom-20">
        <CutsceneEditorPanelMemo />
      </div>
    </Draggable>
  );
};
