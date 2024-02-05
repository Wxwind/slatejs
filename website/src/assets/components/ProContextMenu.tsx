import { FC, PropsWithChildren } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { isNil } from '@/util';
import { ChevronRightIcon } from '@radix-ui/react-icons';

export type ContextListItem = { name: string; onSelect?: (e: Event) => void; children?: ContextListItem[] };

interface ProContextMenuProps {
  list: ContextListItem[];
}

export const ProContextMenu: FC<PropsWithChildren<ProContextMenuProps>> = (props) => {
  const { list, children } = props;

  const renderNode = (item: ContextListItem) => {
    if (isNil(item.children)) {
      return (
        <ContextMenu.Item
          key={item.name}
          className="group text-sm leading-none text-violet-400 rounded flex items-center h-6 px-1 relative pl-6 select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary data-[highlighted]:text-violet-100"
          onSelect={(e) => {
            item.onSelect?.(e);
          }}
        >
          {item.name}
        </ContextMenu.Item>
      );
    }

    return (
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger>
          {item.name}
          <div className="ml-auto pl-5 text-violet-400">
            <ChevronRightIcon />
          </div>
        </ContextMenu.SubTrigger>
        <ContextMenu.Portal>
          <ContextMenu.SubContent className="bg-white rounded" sideOffset={2} alignOffset={-5}>
            {item.children.map((b) => renderNode(b))}
          </ContextMenu.SubContent>
        </ContextMenu.Portal>
      </ContextMenu.Sub>
    );
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="bg-white rounded">
          {list.map((a) => {
            return renderNode(a);
          })}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};
