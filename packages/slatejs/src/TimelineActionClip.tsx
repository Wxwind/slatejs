import { FC, useCallback } from 'react';
import { ActionClip, cutscene } from './core';
import { clamp } from './util';
import { useScaleStore } from './store';
import { ComponentInstanceIcon } from '@radix-ui/react-icons';
import { Keyframe } from 'deer-engine';
import { useDumbState, useBindSignal } from './hooks';

interface TimelineActionClipProps {
  groupId: string;
  trackId: string;
  object: ActionClip;
}

export const TimelineActionClip: FC<TimelineActionClipProps> = (props) => {
  const { groupId, trackId, object } = props;

  const { scale } = useScaleStore();

  const [refresh] = useDumbState();
  useBindSignal(object.signals.clipUpdated, refresh);
  useBindSignal(object.signals.keysChanged, refresh);

  const handleClickBlock = () => {
    cutscene.selectObject(object.id);
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
        let startTime = clamp(object.startTime + offset, 0, object.endTime);

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
        let endTime = Math.max(object.startTime, object.endTime + offset);
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

  let keys: Keyframe[] = [];
  for (const animatedParam of object.animatedData?.animatedParamArray || []) {
    for (const curve of animatedParam.curves) {
      keys.push(...curve.keys);
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
      <div>{object.name}</div>
      {keys.map((key) => (
        <div
          style={{
            position: 'absolute',
            left: key.time * scale,
          }}
        >
          <ComponentInstanceIcon />
        </div>
      ))}
    </div>
  );
};
