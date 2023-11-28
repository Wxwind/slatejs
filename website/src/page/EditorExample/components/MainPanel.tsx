import { FC, useCallback, useRef, useState } from 'react';
import { Hierarchy } from './Hierarchy';
import { Inspector } from './Inspector';
import { clamp, isNil } from '@/util';
import { useWindowSize } from '@/hooks/useWindowSize';

interface MainPanelProps {}

export const MainPanel: FC<MainPanelProps> = (props) => {
  const {} = props;

  const inspectorRef = useRef<HTMLDivElement>(null);
  const [dragLineHeight, setDragLineHeight] = useState<number>(180);
  const [, windowHeight] = useWindowSize();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isNil(inspectorRef.current)) return;

      const startY = e.clientY;
      const initialHeight = inspectorRef.current.clientHeight;
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
    <div className="flex flex-col bg-gray-400 h-full">
      <div className="absolute" style={{ height: `${dragLineHeight}px` }}>
        <Hierarchy />
      </div>
      <div
        className="absolute w-full h-[2px] bg-black cursor-row-resize"
        style={{ top: dragLineHeight }}
        onMouseDown={handleMouseDown}
      />
      <div ref={inspectorRef} className="absolute" style={{ top: `${dragLineHeight + 2}px` }}>
        <Inspector />
      </div>
    </div>
  );
};
