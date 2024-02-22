import { FC, useCallback, useRef, useState } from 'react';
import { Hierarchy } from './Hierarchy';
import { Inspector } from './Inspector';
import { isNil } from '@/util';
import { useWindowSize } from '@/hooks/useWindowSize';
import { DeerScene, clamp, cutsceneEditor } from 'deer-engine';

interface MainPanelProps {
  scene: DeerScene | undefined;
}

export const MainPanel: FC<MainPanelProps> = (props) => {
  const { scene } = props;

  const hierarchyRef = useRef<HTMLDivElement>(null);
  const [dragLineHeight, setDragLineHeight] = useState<number>(280);
  const [, windowHeight] = useWindowSize();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isNil(hierarchyRef.current)) return;

      const startY = e.clientY;
      const initialHeight = hierarchyRef.current.clientHeight;
      const handleMouseMove = (e: MouseEvent) => {
        const newHeight = initialHeight + (e.clientY - startY);
        const a = clamp(newHeight, windowHeight * 0.2, windowHeight * 0.8);
        setDragLineHeight(a);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [windowHeight]
  );

  return (
    <div className="relative flex flex-col bg-gray-400 h-full">
      <div ref={hierarchyRef} className="absolute w-full" style={{ height: `${dragLineHeight}px` }}>
        <Hierarchy scene={scene} />
      </div>
      <div
        className="absolute w-full h-[2px] bg-black cursor-row-resize"
        style={{ top: dragLineHeight }}
        onMouseDown={handleMouseDown}
      />
      <div className="absolute w-full bottom-0" style={{ top: `${dragLineHeight + 2}px` }}>
        <Inspector scene={scene} cutsceneEditor={cutsceneEditor} />
      </div>
    </div>
  );
};
