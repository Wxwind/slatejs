import { FC } from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { transformKeymap } from './keymap';
import { DeerScene, MeshComponent, deerEngine } from 'deer-engine';
import { downLoad, isNil } from '@/util';
import { cutsceneEditor } from 'deer-engine';
import { Message } from '@arco-design/web-react';

interface HeaderProps {
  scene: DeerScene | undefined;
}

export const Header: FC<HeaderProps> = (props) => {
  const { scene } = props;

  const handleExport = () => {
    if (deerEngine.activeScene) {
      const data = deerEngine.exportScene(deerEngine.activeScene);
      const json = JSON.stringify(data);
      const file = new File([json], data.name + '.json', {
        type: 'application/json',
      });
      downLoad(file);
    } else {
      Message.error('current scene is invalid');
    }
  };

  const handleSave = () => {
    // TODO: save engine datas
    const json = JSON.stringify(cutsceneEditor.cutscene.serialize());
    const file = new File([json], 'cutScene.json', { type: 'text/plain' });
    downLoad(file);
  };

  const handleCreateEntity = () => {
    if (isNil(scene)) {
      console.error('create entity failed: no activated scene');
      return;
    }
    const e = scene.entityManager.createEntity('Cube', scene.entityManager.selectedEntity);
    e.addComponentByNew(MeshComponent);
  };

  const handleRedo = () => {
    deerEngine.commandManager.redo();
  };

  const handleUndo = () => {
    deerEngine.commandManager.undo();
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
              New Project <div className="ml-auto pl-5">{transformKeymap('shift n')}</div>
            </Menubar.Item>
            <Menubar.Separator className="h-[1px] bg-slate-400 m-[5px]" />
            <Menubar.Item className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400">
              Open... <div className="ml-auto pl-5">{transformKeymap('shift alt g')}</div>
            </Menubar.Item>
            <Menubar.Separator className="h-[1px] bg-slate-400 m-[5px]" />
            <Menubar.Item
              className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400"
              onSelect={handleSave}
            >
              Save <div className="ml-auto pl-5">{transformKeymap('ctrl s')}</div>
            </Menubar.Item>
            <Menubar.Item
              className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400"
              onSelect={handleExport}
            >
              Export <div className="ml-auto pl-5">{transformKeymap('shift ctrl s')}</div>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="text-sm py-2 px-3 outline-none select-none leading-none rounded  flex items-center justify-between">
          Edit
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
              onSelect={handleUndo}
            >
              Undo <div className="ml-auto pl-5">{transformKeymap('shift z')}</div>
            </Menubar.Item>
            <Menubar.Item
              className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400"
              onSelect={handleRedo}
            >
              Redo <div className="ml-auto pl-5">{transformKeymap('shift ctrl z')}</div>
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
