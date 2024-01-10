import { FC, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Cutscene } from 'deer-engine';
import { CutsceneEditor } from '@/module/slatejs';

export const Timeline: FC = () => {
  const [scene, setScene] = useState(new Cutscene());
  const [pos, setPos] = useState<{ x: number; y: number }>();

  const nodeRef = useRef(null);

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
    <Draggable nodeRef={nodeRef} handle=".controls" position={pos} onDrag={handleDrag}>
      <div ref={nodeRef} className="w-3/4 h-80 absolute bottom-20 left-0 right-0 m-auto">
        <CutsceneEditor />
      </div>
    </Draggable>
  );
};
