import { Stage } from 'react-konva';
import { SelectionLayer } from './SelectionLayer';
import { useStageStore } from '@/store';
import { useEffect, useRef } from 'react';
import { isNil } from '@/util';

interface FlowEditorProps {}

export function FlowEditor(props: FlowEditorProps) {
  const {} = props;

  const { width, height, setSize } = useStageStore();
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Stage width={width} height={height} draggable={true}>
        <SelectionLayer />
      </Stage>
    </div>
  );
}
