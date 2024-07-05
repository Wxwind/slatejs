import { BPConnection, BPPinDirection } from '@/interface';
import Konva from 'konva';
import { FC, useState } from 'react';
import { Line } from 'react-konva';

const strokeWidth = 2;
const highlightStrokeWidth = 4;

interface ConnectionProps {
  from: Konva.Vector2d;
  to: Konva.Vector2d;
  highlight?: boolean;
  fromDirection: BPPinDirection;
}

export const Connection: FC<ConnectionProps> = (props) => {
  const { highlight, from, to, fromDirection } = props;

  const [isHovering, setisHovering] = useState(false);

  // hermite to bezier
  const points = (() => {
    let p0, p3;
    if (fromDirection === 'out') {
      p0 = from;
      p3 = to;
    } else {
      p0 = to;
      p3 = from;
    }

    const oneThird = 1 / 3;
    const u0 = 0;
    const u1 = 0;
    const dt = p3.x - p0.x;

    // p1 = (key1.time + dt * oneThird, key1.value + key1.outTangent * dt * oneThird)
    const p1x = p0.x + dt * oneThird;
    const p1y = p0.y + u0 * dt * oneThird;
    // p2 = (key2.time - dt * oneThird, key2.value - key2.outTangent * dt * oneThird)
    const p2x = p3.x - dt * oneThird;
    const p2y = p3.y - u1 * dt * oneThird;

    return [p0.x, p0.y, p1x, p1y, p2x, p2y, p3.x, p3.y];
  })();

  return (
    <Line
      name="connection"
      stroke="white"
      points={points}
      strokeWidth={highlight || isHovering ? highlightStrokeWidth : strokeWidth}
      bezier
      onPointerEnter={() => {
        setisHovering(true);
      }}
      onPointerLeave={() => {
        setisHovering(false);
      }}
    />
  );
};
