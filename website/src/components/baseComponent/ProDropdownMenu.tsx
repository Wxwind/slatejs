import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { FC, PropsWithChildren } from 'react';

export type DroplistItem = { name: string; onSelect: (e: Event) => void };

interface ProDropdownMenuProps {
  list: DroplistItem[];
}

export const ProDropdownMenu: FC<PropsWithChildren<ProDropdownMenuProps>> = (props) => {
  const { list, children } = props;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white rounded">
          {list.map((item) => (
            <DropdownMenu.Item
              key={item.name}
              className="group text-sm leading-none text-violet-400 rounded flex items-center h-6 px-2 relative select-none outline-none data-[disabled]:text-gray-300 data-[disabled]:pointer-events-none data-[highlighted]:bg-primary data-[highlighted]:text-violet-100"
              onSelect={(e) => {
                item.onSelect(e);
              }}
            >
              {item.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
