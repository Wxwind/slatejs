import { useGraphStore } from '@/store';
import { Layer, Rect } from 'react-konva';

export function NodeLayer() {
  const nodes = useGraphStore((state) => state.nodeMap);

  return <Layer></Layer>;
}
