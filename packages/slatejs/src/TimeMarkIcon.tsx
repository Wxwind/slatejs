import { FC, useEffect, useRef } from 'react';
import { isNil } from './util';

const TimeMarkIcon: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (isNil(canvas)) return;
    const ctx = canvas.getContext('2d');
    if (isNil(ctx)) return;
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(2, 0);
    ctx.lineTo(14, 0);
    ctx.lineTo(14, 10);
    ctx.lineTo(8, 16);
    ctx.lineTo(2, 10);
    ctx.lineTo(2, 0);
    ctx.fill();
  }, []);
  return <canvas ref={ref} width={16} height={16} />;
};

export default TimeMarkIcon;
