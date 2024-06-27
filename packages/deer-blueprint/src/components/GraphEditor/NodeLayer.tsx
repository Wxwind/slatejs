import { BaseNode } from '@/nodes';
import { useGraphStore } from '@/store';
import { Layer } from 'react-konva';

export function NodeLayer() {
  const nodes = useGraphStore((state) => state.nodeMap);

  return (
    <Layer>
      {Object.values(nodes).map((node) => (
        <BaseNode key={node.id} data={node} />
      ))}
    </Layer>
  );
}
