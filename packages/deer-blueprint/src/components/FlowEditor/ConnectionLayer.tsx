import { Layer, Rect } from 'react-konva';

interface ConnectionLayerProps {}

export function ConnectionLayer(props: ConnectionLayerProps) {
  const {} = props;

  return (
    <Layer>
      <Rect stroke="#ffff00" fill="#fffff02" width={20} height={50}></Rect>
    </Layer>
  );
}
