import { Entity, EntityForHierarchy } from 'deer-engine';
import { FC, useEffect, useRef, useState } from 'react';
import { EntityTree } from './EntityTree';
import classNames from 'classnames';
import { useDrag, useDrop } from 'react-dnd';
import { DndEntityDragObject, DragDropItemId } from '@/constants';
import { isNil } from '@/util';

interface EntityProps {
  data: EntityForHierarchy;
  selectedEntities: Entity[] | undefined;
  depth: number;
  onTreeNodeSelected: (id: string) => void;
}

type HoverState = 'above' | 'below' | 'inside' | 'none';

export const EntityTreeNode: FC<EntityProps> = (props) => {
  const { data, selectedEntities, depth, onTreeNodeSelected } = props;

  const treeNodeRef = useRef<HTMLDivElement | null>(null);
  const isSelected = selectedEntities?.find((a) => a.id === data.id) || false;

  const [hoverState, setHoverState] = useState<HoverState>('none');

  const [, drag, dragPreview] = useDrag<DndEntityDragObject>({
    type: DragDropItemId.Entity,
    item: { entityId: data.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: DragDropItemId.Entity,
      drop: (dragObject: DndEntityDragObject, monitor) => {
        if (!monitor.didDrop()) {
          //TODO: move dragObject.entityId to data.id by hoverState
          console.warn(`not implemented: move ${dragObject.entityId} to ${data.id} by hoverState ${hoverState}`);
        }
      },
      canDrop: (dragObject: DndEntityDragObject) => {
        return !selectedEntities?.find((a) => a.id === data.id);
      },
      hover: (_, monitor) => {
        const clientOffset = monitor.getClientOffset();
        if (!monitor.canDrop()) {
          setHoverState('none');
          return;
        }
        if (!treeNodeRef.current || isNil(clientOffset)) {
          setHoverState('none');
          return;
        }
        let state: HoverState = 'none';
        const rect = treeNodeRef.current.getBoundingClientRect();
        const pointerOffsetTop = clientOffset.y - rect.y;

        if (pointerOffsetTop > 0 && pointerOffsetTop < rect.height) {
          state =
            pointerOffsetTop < rect.height / 3
              ? 'above'
              : pointerOffsetTop < (rect.height * 2) / 3
                ? 'inside'
                : // : data.isCollapsed
                  //   ? 'below'
                  //   : 'none';
                  'below';
        }

        setHoverState(state);
        // console.log(
        //   'pointerOffsetTop',
        //   clientOffset?.y,
        //   treeNodeRef.current?.getBoundingClientRect().y,
        //   pointerOffsetTop,
        // );
      },

      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [selectedEntities, data.id, hoverState]
  );

  // reset hover state
  useEffect(() => {
    if (!isOver) {
      setHoverState('none');
    }
  }, [isOver]);

  const hoverClassName = (() => {
    switch (hoverState) {
      case 'above':
        return 'drag-above';
      case 'below':
        return 'drag-below';
      case 'inside':
        return 'drag-inside';
      case 'none':
        return;
    }
  })();

  return (
    <div>
      <div
        draggable
        ref={(node) => {
          treeNodeRef.current = node;
          return dragPreview(drop(drag(node)));
        }}
        className={classNames(
          `group pr-2 h-6 mt-[1px] flex gap-x-1 items-center flex-1 relative`,
          isSelected ? 'text-white bg-primary cursor-default' : 'cursor-pointer hover:bg-hover hover:text-white',
          hoverClassName
        )}
        style={{ paddingLeft: `${18 * depth}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onTreeNodeSelected(data.id);
        }}
      >
        {data.name}
      </div>
      <EntityTree
        data={data.children}
        selectedEntities={selectedEntities}
        depth={depth + 1}
        onTreeNodeSelected={onTreeNodeSelected}
      />
    </div>
  );
};
