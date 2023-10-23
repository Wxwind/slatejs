import { FC, useCallback } from 'react';
import { ResourceJson } from './core/resourceClip';
import { CutScene } from './core';
import { clamp } from './utils';

interface TrackBlockProps {
  cutScene: CutScene;
  resourceJSON: ResourceJson;
}

const TrackBlock: FC<TrackBlockProps> = (props) => {
  const { resourceJSON, cutScene } = props;

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

        // TODO: replace with timeline.scale
        resourceJSON.start += mx / 32;
        resourceJSON.end += mx / 32;

        if (resourceJSON.start < 0) {
          const offset = -resourceJSON.start;
          resourceJSON.start += offset;
          resourceJSON.end += offset;
        }

        my += e.movementY;
        console.log(my);
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
    [cutScene.resourcesStore, resourceJSON]
  );

  const handleDragLeft = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const onMouseMove = (e: MouseEvent) => {
        const mx = e.movementX;

        const offset = mx / 32;
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
    [cutScene.resourcesStore, resourceJSON]
  );

  const handleDragRight = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const onMouseMove = (e: MouseEvent) => {
        const mx = e.movementX;

        const offset = mx / 32;
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
    [cutScene.resourcesStore, resourceJSON]
  );

  return (
    <div
      className="track-block"
      onClick={handleClickBlock}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: resourceJSON.start * 32,
        top: resourceJSON.layerId * 32,
        width: (resourceJSON.end - resourceJSON.start) * 32,
      }}
    >
      <div className="resize-left" onMouseDown={handleDragLeft} />
      <div className="resize-right" onMouseDown={handleDragRight} />
      <div>{resourceJSON.name}</div>
    </div>
  );
};

export default TrackBlock;
