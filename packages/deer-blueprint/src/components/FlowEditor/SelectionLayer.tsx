import { isNil } from '@/util';
import konva from 'konva';
import { KonvaEventListener } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import { FC, useEffect, useRef } from 'react';
import { Layer } from 'react-konva';
import { useImmer } from 'use-immer';

export const SelectionLayer: FC = () => {
  const {} = useImmer({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const layerRef = useRef<konva.Layer>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (isNil(layer)) return;

    const handleMouseDown = (e: konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (e.target !== stage) {
        return;
      }
      console.log('mousedown', e, e.target.getPointerPosition());
      if (stage.draggable() === true) {
        return;
      }
    };

    const stage = layer.getStage();
    stage.on('mousedown', handleMouseDown);

    return () => {};
  }, []);

  return <Layer ref={layerRef}></Layer>;
};
