import { FC, useCallback } from 'react';
import { ActionClip, cutsceneEditor } from 'deer-engine';
import { useScaleStore } from './store';
import { ComponentInstanceIcon } from '@radix-ui/react-icons';
import { clamp } from 'deer-engine';
import { useDumbState, useBindSignal } from '@/hooks';

interface TimelineActionClipProps {
  object: ActionClip;
}

export const TimelineActionClip: FC<TimelineActionClipProps> = (props) => {
  const { object } = props;

  const { scale } = useScaleStore();

  const refresh = useDumbState();
  useBindSignal(object.signals.clipUpdated, refresh);
  useBindSignal(object.signals.keysChanged, refresh);

  const handleClickBlock = () => {
    cutsceneEditor.selectObject(object.id);
  };

  // drag block
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let mx = 0;

      const onMouseMove = (e: MouseEvent) => {
        mx = e.movementX;

        let startTime = object.startTime + mx / scale;
        let endTime = object.endTime + mx / scale;

        if (object.startTime < 0) {
          const offset = -object.startTime;
          startTime = object.startTime + offset;
          endTime = object.endTime + offset;
        }

        object.updateData({
          startTime,
          endTime,
        });
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [object, scale]
  );

  const handleDragLeft = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const onMouseMove = (e: MouseEvent) => {
        const mx = e.movementX;

        const offset = mx / scale;
        const startTime = clamp(object.startTime + offset, 0, object.endTime);

        object.updateData({
          startTime,
        });
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [object, scale]
  );

  const handleDragRight = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const onMouseMove = (e: MouseEvent) => {
        const mx = e.movementX;

        const offset = mx / scale;
        const endTime = Math.max(object.startTime, object.endTime + offset);
        object.updateData({
          endTime,
        });
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [object, scale]
  );

  const keys: number[] = [];
  for (const animatedParam of object.animatedData?.animatedParamArray || []) {
    for (const curve of animatedParam.curves) {
      for (const key of curve.keys) {
        if (!keys.includes(key.time)) {
          keys.push(key.time);
        }
      }
    }
  }

  return (
    <div
      className="timeline-action-clip"
      onClick={handleClickBlock}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: object.startTime * scale,
        width: (object.endTime - object.startTime) * scale,
      }}
    >
      <div className="resize-left" onMouseDown={handleDragLeft} />
      <div className="resize-right" onMouseDown={handleDragRight} />
      <div className="flex items-center h-full">{object.name}</div>
      {keys.map((key) => (
        <div
          key={`${key}`}
          style={{
            position: 'absolute',
            left: key * scale,
          }}
        >
          <ComponentInstanceIcon />
        </div>
      ))}
    </div>
  );
};
