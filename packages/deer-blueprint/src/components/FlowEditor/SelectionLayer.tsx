import { useStageStore } from '@/store';
import { isNil } from '@/util';
import Konva from 'konva';
import { FC, useEffect, useRef, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import { useImmer } from 'use-immer';

export const SelectionLayer: FC = () => {
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useImmer({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const layerRef = useRef<Konva.Layer>(null);
  const { getPointerWorldPosition } = useStageStore();

  useEffect(() => {
    const layer = layerRef.current;
    if (isNil(layer)) return;

    const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (e.target !== stage) {
        return;
      }

      if (stage.draggable() === true) {
        return;
      }

      const worldPos = getPointerWorldPosition(stage);

      setRect({
        x1: worldPos.x,
        y1: worldPos.y,
        x2: worldPos.x,
        y2: worldPos.y,
      });
      setVisible(true);

      const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        const position = stage.getPointerPosition();

        if (isNil(position)) {
          setVisible(false);
          return;
        }

        const worldPos = getPointerWorldPosition(stage);

        setRect((draft) => {
          draft.x2 = worldPos.x;
          draft.y2 = worldPos.y;
        });
      };

      const handlePointerUpLeave = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        setVisible(false);
        stage.off('mousemove touchmove', handlePointerMove);
        stage.off('mouseup touchend', handlePointerUpLeave);
        stage.off('mouseleave touchcancel', handlePointerUpLeave);
      };

      stage.on('mousemove touchmove', handlePointerMove);
      stage.on('mouseup touchend', handlePointerUpLeave);
      stage.on('mouseleave touchcancel', handlePointerUpLeave);
    };

    const stage = layer.getStage();
    stage.on('mousedown touchstart', handlePointerDown);

    return () => {
      stage.off('mousedown touchstart', handlePointerDown);
    };
  }, []);

  return (
    <Layer ref={layerRef}>
      <Rect
        visible={visible}
        stroke="rgba(255,255,0,0.8)"
        fill="rgba(255,255,0,0.4)"
        x={Math.min(rect.x1, rect.x2)}
        y={Math.min(rect.y1, rect.y2)}
        width={Math.abs(rect.x2 - rect.x1)}
        height={Math.abs(rect.y2 - rect.y1)}
      ></Rect>
    </Layer>
  );
};
