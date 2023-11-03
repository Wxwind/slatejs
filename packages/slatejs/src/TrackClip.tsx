import { FC, useCallback } from 'react';
import { CutScene, ActionClipJson } from './core';
import { clamp } from './utils';

interface TrackBlockProps {
  cutScene: CutScene;
  resourceJSON: ActionClipJson;
}

const TrackClip: FC<TrackBlockProps> = (props) => {
  const { resourceJSON, cutScene } = props;

  const { scale } = cutScene.useScaleStore();

  const handleClickBlock = () => {
    cutScene.selectAnimation(resourceJSON.id);
  };

  // drag block
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let mx = 0;
      let my = 0;

      const onMouseMove = (e: MouseEvent) => {
        mx = e.movementX;

        resourceJSON.start += mx / scale;
        resourceJSON.end += mx / scale;

        if (resourceJSON.start < 0) {
          const offset = -resourceJSON.start;
          resourceJSON.start += offset;
          resourceJSON.end += offset;
        }

        my += e.movementY;

        if (my >= 30) {
          // TODO: clamp max layer
          resourceJSON.layerId += 1;
          my = 0;
        } else if (my <= -30) {
          resourceJSON.layerId = Math.max(0, resourceJSON.layerId - 1);
          my = 0;
        }

        cutScene.resourcesStore.updateAnimation(resourceJSON.id, resourceJSON);
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [cutScene.resourcesStore, resourceJSON, scale]
  );

  const handleDragLeft = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const onMouseMove = (e: MouseEvent) => {
        const mx = e.movementX;

        const offset = mx / scale;
        resourceJSON.start = clamp(resourceJSON.start + offset, 0, resourceJSON.end);
        cutScene.resourcesStore.updateAnimation(resourceJSON.id, resourceJSON);
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [cutScene.resourcesStore, resourceJSON, scale]
  );

  const handleDragRight = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const onMouseMove = (e: MouseEvent) => {
        const mx = e.movementX;

        const offset = mx / scale;
        resourceJSON.end = Math.max(resourceJSON.start, resourceJSON.end + offset);
        cutScene.resourcesStore.updateAnimation(resourceJSON.id, resourceJSON);
      };

      const onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [cutScene.resourcesStore, resourceJSON, scale]
  );

  return (
    <div
      className="track-block"
      onClick={handleClickBlock}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: resourceJSON.start * scale,
        top: resourceJSON.layerId * 32,
        width: (resourceJSON.end - resourceJSON.start) * scale,
      }}
    >
      <div className="resize-left" onMouseDown={handleDragLeft} />
      <div className="resize-right" onMouseDown={handleDragRight} />
      <div>{resourceJSON.name}</div>
    </div>
  );
};

export default TrackClip;
