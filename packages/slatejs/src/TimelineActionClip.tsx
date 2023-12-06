import { FC, useCallback } from 'react';
import { ActionClipData, cutscene } from './core';
import { clamp } from './util';
import { useScaleStore } from './store';

interface TimelineActionClipProps {
  groupId: string;
  trackId: string;
  data: ActionClipData;
}

export const TimelineActionClip: FC<TimelineActionClipProps> = (props) => {
  const { groupId, trackId, data } = props;

  const { scale } = useScaleStore();

  const handleClickBlock = () => {
    cutscene.selectObject(data.id);
  };

  // drag block
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let mx = 0;

      const onMouseMove = (e: MouseEvent) => {
        mx = e.movementX;

        data.start += mx / scale;
        data.end += mx / scale;

        if (data.start < 0) {
          const offset = -data.start;
          data.start += offset;
          data.end += offset;
        }

        cutscene.apiCenter.updateClip(groupId, trackId, data.id, data.type, data);
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [data, scale]
  );

  const handleDragLeft = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const onMouseMove = (e: MouseEvent) => {
        const mx = e.movementX;

        const offset = mx / scale;
        data.start = clamp(data.start + offset, 0, data.end);
        // FIXME
        //cutscene.cutsceneDataStore.updateClip(data.id, data);
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [data, scale]
  );

  const handleDragRight = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const onMouseMove = (e: MouseEvent) => {
        const mx = e.movementX;

        const offset = mx / scale;
        data.end = Math.max(data.start, data.end + offset);
        // FIXME
        //cutscene.cutsceneDataStore.updateClip(data.id, data);
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [data, scale]
  );

  return (
    <div
      className="timeline-action-clip"
      onClick={handleClickBlock}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: data.start * scale,
        width: (data.end - data.start) * scale,
      }}
    >
      <div className="resize-left" onMouseDown={handleDragLeft} />
      <div className="resize-right" onMouseDown={handleDragRight} />
      <div>{data.name}</div>
    </div>
  );
};
