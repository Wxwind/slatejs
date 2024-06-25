import { Layer, Rect } from 'react-konva';

export function ConnectionLayer() {
  return (
    <Layer>
      <Rect stroke="#ffff00" fill="#fffff02" width={20} height={50}></Rect>
    </Layer>
  );
}
