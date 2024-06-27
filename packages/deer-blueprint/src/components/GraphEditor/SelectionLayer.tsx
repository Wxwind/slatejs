import { NODE_NAME, ThemeStyle } from '@/constants';
import { useSelectedInfoStore, useStageStore } from '@/store';
import { isCtrlKeyHold, isNil, isShiftKeyHold } from '@/util';
import Konva from 'konva';
import { FC, useEffect, useRef, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import { useImmer } from 'use-immer';

export const SelectionLayer: FC = () => {
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useImmer({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const layerRef = useRef<Konva.Layer>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  const { getPointerWorldPosition } = useStageStore();
  const addSelectedNodes = useSelectedInfoStore((state) => state.addSelectedNodes);
  const toggleSelectedNodes = useSelectedInfoStore((state) => state.toggleSelectedNodes);

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
        const nodes = stage.find(`.${NODE_NAME}`);
        const box = selectionRectRef.current?.getClientRect();
        if (!box) return;

        const selected = nodes
          .filter((node) => Konva.Util.haveIntersection(box, node.getClientRect({ skipShadow: true })))
          .map((node) => node.id());

        if (isCtrlKeyHold(e.evt)) {
          toggleSelectedNodes(selected);
        } else if (isShiftKeyHold(e.evt)) {
          addSelectedNodes(selected);
        } else {
          addSelectedNodes(selected, true);
        }

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
        ref={selectionRectRef}
        visible={visible}
        stroke={ThemeStyle.selection.stroke}
        fill={ThemeStyle.selection.fill}
        x={Math.min(rect.x1, rect.x2)}
        y={Math.min(rect.y1, rect.y2)}
        width={Math.abs(rect.x2 - rect.x1)}
        height={Math.abs(rect.y2 - rect.y1)}
      />
    </Layer>
  );
};
