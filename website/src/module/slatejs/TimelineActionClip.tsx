import { FC, useCallback, useState } from 'react';
import { ActionClip, CutsceneTrack, cutsceneEditor } from 'deer-engine';
import { useScaleStore } from './store';
import { BsDiamond } from 'react-icons/bs';
import { clamp } from 'deer-engine';
import { useDumbState, useBindSignal } from '@/hooks';
import classNames from 'classnames';
import { ContextListItem, ProContextMenu } from '@/components/baseComponent';

interface TimelineActionClipProps {
  object: ActionClip;
}

export const TimelineActionClip: FC<TimelineActionClipProps> = (props) => {
  const { object } = props;

  const [offsetX, setOffsetX] = useState(0);
  const { scale } = useScaleStore();

  const refresh = useDumbState();
  useBindSignal(object.signals.clipUpdated, refresh);
  useBindSignal(object.signals.keysChanged, refresh);

  // emitted when curve updated in curve editor
  useBindSignal(object.animatedData.signals.updated, refresh);

  const selectedClip = cutsceneEditor.selectedClip;
  useBindSignal(cutsceneEditor.signals.selectedClipUpdated, refresh);

  const handleClickBlock = () => {
    cutsceneEditor.selectedClip = object;
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

        if (startTime >= 0) {
          object.updateData({
            startTime,
            endTime,
          });
        }
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

  const contextList: ContextListItem[] = [
    {
      name: 'delete',
      onSelect: (e) => {
        (object.parent as CutsceneTrack).removeClip(object);
      },
    },
    {
      name: 'add key',
      onSelect: () => {
        const time = offsetX / scale;
        object.animatedData.tryAddKey(time);
      },
    },
  ];

  return (
    <ProContextMenu list={contextList}>
      <div
        className={classNames(
          'absolute top-0 h-[31px] border-[#aaf] border rounded-sm overflow-hidden text-ellipsis whitespace-nowrap select-none',
          selectedClip?.id === object.id ? ' bg-slate-400' : 'bg-[#88f]'
        )}
        onClick={handleClickBlock}
        onMouseDown={handleMouseDown}
        onContextMenu={(e) => {
          setOffsetX(e.nativeEvent.offsetX);
        }}
        style={{
          left: object.startTime * scale,
          width: (object.endTime - object.startTime) * scale,
        }}
      >
        <div
          className={'absolute top-0 left-0 w-[6px] h-[30px] cursor-w-resize'}
          onMouseDown={handleDragLeft}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <div
          className={'absolute top-0 right-0 w-[6px] h-[30px] cursor-e-resize'}
          onMouseDown={handleDragRight}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
        <div className={classNames('flex items-center h-2/3', object)}>{object.name}</div>
        <div className="h-1/3 bg-slate-200">
          {keys.map((key) => (
            <div
              key={`${key}`}
              style={{
                position: 'absolute',
                left: key * scale - 10 / 2,
              }}
            >
              <BsDiamond fontSize={10} />
            </div>
          ))}
        </div>
      </div>
    </ProContextMenu>
  );
};
