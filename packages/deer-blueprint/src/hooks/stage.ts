import { globalEventEmitter } from '@/event';
import Konva from 'konva';
import { useEffect, useState } from 'react';

export const useGetPointerPos = () => {
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onStageMove = (pos: Konva.Vector2d) => {
      setPointerPos(pos);
    };

    globalEventEmitter.on('stageMove', onStageMove);

    return () => {
      globalEventEmitter.off('stageMove', onStageMove);
    };
  }, []);

  return pointerPos;
};
