import { FC, PropsWithChildren } from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { isNil } from '@/util';
import { RxChevronRight } from 'react-icons/rx';

export type ContextListItem = { name: string; onSelect?: (e: Event) => void; children?: ContextListItem[] };

interface ProContextMenuProps {
  list: ContextListItem[];
  modal?: boolean;
  disabled?: boolean;
  onOpenChange?: (v: boolean) => void;
}

export const ProContextMenu: FC<PropsWithChildren<ProContextMenuProps>> = (props) => {
  const { children, list, disabled, modal, onOpenChange } = props;

  const renderNode = (item: ContextListItem) => {
    if (isNil(item.children)) {
      return (
        <ContextMenu.Item
          key={item.name}
          className="group text-sm leading-none text-violet-400 rounded flex items-center h-6 px-2 relative select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary data-[highlighted]:text-violet-100 cursor-pointer"
          onSelect={(e) => {
            console.log('sth select3ed', item.onSelect);
            item.onSelect?.(e);
          }}
        >
          {item.name}
        </ContextMenu.Item>
      );
    }

    return (
      <ContextMenu.Sub key={item.name}>
        <ContextMenu.SubTrigger className="flex items-center data-[highlighted]:bg-primary data-[highlighted]:text-violet-100 px-2">
          {item.name}
          <div className="ml-auto pl-5 text-violet-400">
            <RxChevronRight />
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
    <ContextMenu.Root modal={modal} onOpenChange={onOpenChange}>
      <ContextMenu.Trigger onContextMenu={(e) => disabled && e.preventDefault()}>{children}</ContextMenu.Trigger>
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
