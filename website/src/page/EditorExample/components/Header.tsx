import { FC } from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { DeerEngine } from 'deer-engine';
import { DEERENGINE_SCENE } from '@/config';
import { isNil } from '@/util';

export const Header: FC = () => {
  const handleCreateEntity = () => {
    const scene = DeerEngine.instance.getScene(DEERENGINE_SCENE);
    if (isNil(scene)) return;
    scene.entityStore.createEntity();
  };

  return (
    <Menubar.Root className="flex p-1 bg-gray-300">
      <Menubar.Menu>
        <Menubar.Trigger className="text-sm py-2 px-3 outline-none select-none leading-none rounded  flex items-center justify-between">
          File
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[220px] bg-gray-300 rounded-md p-1"
            align="start"
            sideOffset={5}
            alignOffset={-3}
          >
            <Menubar.Item className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400">
              New Project <div className="ml-auto pl-5">⌘ N</div>
            </Menubar.Item>
            <Menubar.Separator className="h-[1px] bg-slate-400 m-[5px]" />
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
      <Menubar.Menu>
        <Menubar.Trigger className="text-sm py-2 px-3 outline-none select-none leading-none rounded  flex items-center justify-between">
          New
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[220px] bg-gray-300 rounded-md p-1"
            align="start"
            sideOffset={5}
            alignOffset={-3}
          >
            <Menubar.Item
              className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400"
              onSelect={handleCreateEntity}
            >
              New Cube
            </Menubar.Item>
            <Menubar.Separator className="h-[1px] bg-slate-400 m-[5px]" />
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};
