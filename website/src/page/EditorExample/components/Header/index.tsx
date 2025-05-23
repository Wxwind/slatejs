import { FC, useState } from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { transformKeymap } from './keymap';
import {
  DeerScene,
  MeshComponent,
  CommandManager,
  FileManager,
  SceneManager,
  StaticRigidbodyComponent,
  BoxCollider,
  THREE,
  CharacterControllerComponent,
  ResourceManager,
  CapsuleCollider,
  DynamicRigidbodyComponent,
} from 'deer-engine';
import { downLoad, isNil } from '@/util';
import { Message } from '@arco-design/web-react';
import { FileUpload } from '@/components';
import { useCutsceneEditorStore, useEngineStore } from '@/store';
import { CharacterControllerScript } from '@/scripts/CharacterControllerScript';
import { ShootScript } from '@/scripts/ShootScript';
import { CollEventTestScript } from '@/scripts/CollEventTest';
import { CubeMoveScript } from '@/scripts/CubeMoveScript';

interface HeaderProps {
  scene: DeerScene | undefined;
}

export const Header: FC<HeaderProps> = (props) => {
  const { scene } = props;

  const { engine: deerEngine } = useEngineStore();
  const { cutsceneEditor } = useCutsceneEditorStore();
  const [isRunning, setIsRunning] = useState(false);

  const handleUploadFile = async (fileList: FileList) => {
    if (!deerEngine) return;
    const fileManager = deerEngine.getManager(FileManager);
    try {
      const promises = [];
      for (const file of fileList) {
        promises.push(fileManager.uploadAsset(file.name, file));
      }
      await Promise.all(promises);
      Message.success('upload success!');
    } catch (error) {
      Message.error(`upload failed, reason: ${(error as Error).message}`);
      console.error(error);
    }
  };

  const handleExport = () => {
    if (!deerEngine) return;
    const sceneManager = deerEngine.getManager(SceneManager);
    if (sceneManager.mainScene) {
      const data = sceneManager.exportScene(sceneManager.mainScene);
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
    if (!cutsceneEditor) return;
    const json = JSON.stringify(cutsceneEditor.cutscene.serialize());
    const file = new File([json], 'cutScene.json', { type: 'text/plain' });
    downLoad(file);
  };

  const handleCreateCCT = () => {
    if (isNil(scene)) {
      console.error('create entity failed: no activated scene');
      return;
    }
    const e = scene.entityManager.createEntity('Soldier', scene.entityManager.selectedEntity || null);
    e.transform.position = {
      x: 0,
      y: 3,
      z: 0,
    };

    const loadModel = async (address: string) => {
      const obj = await e.engine.getManager(ResourceManager).loadModelAsync(address);
      if (!obj) {
        console.error(`load model failed: ${address}`);
        return;
      }
      e.sceneObject.add(obj);
    };
    loadModel('/model/people.glb');

    const capsuleCollider = new CapsuleCollider();
    const cct = e.addComponent(CharacterControllerComponent);
    cct.addCollider(capsuleCollider);
    cct.radius = 0.25;
    cct.height = 0.5;
    const controller = e.addComponent(CharacterControllerScript);
    // const fpCameraController = e.addComponent(FirstPersonCameraControllerScript);
    // controller._isFirstPerson = true;
    const shooter = e.addComponent(ShootScript);
    e.addComponent(CollEventTestScript);
  };

  const handleCreateFloor = () => {
    if (isNil(scene)) {
      console.error('create entity failed: no activated scene');
      return;
    }
    const e = scene.entityManager.createEntity('Plane', scene.entityManager.selectedEntity || null);
    e.transform.scale = {
      x: 20,
      y: 1,
      z: 20,
    };
    e.addComponent(MeshComponent);
    const rb = e.addComponent(StaticRigidbodyComponent);
    const boxCollider = new BoxCollider();
    rb.addCollider(boxCollider);
    handleCreateSlope();
  };

  const handleCreateCube = () => {
    if (isNil(scene)) {
      console.error('create entity failed: no activated scene');
      return;
    }
    const e = scene.entityManager.createEntity('Cube', scene.entityManager.selectedEntity || null);
    e.transform.position = {
      x: 0,
      y: 4,
      z: 0,
    };
    e.addComponent(MeshComponent);
    // e.addComponent(CubeMoveScript);
    e.addComponent(CollEventTestScript);
    const rb = e.addComponent(DynamicRigidbodyComponent);
    rb.isKinematic = false;
    const boxCollider = new BoxCollider();
    boxCollider.isTrigger = false;
    rb.addCollider(boxCollider);
  };

  const handleCreateSlope = () => {
    if (isNil(scene)) {
      console.error('create entity failed: no activated scene');
      return;
    }
    const e = scene.entityManager.createEntity('Slope', scene.entityManager.selectedEntity || null);
    e.transform.scale = {
      x: 20,
      y: 1,
      z: 20,
    };
    e.transform.rotation = {
      x: 20,
      y: 0,
      z: 0,
    };
    e.transform.position = {
      x: 0,
      y: 0,
      z: -6,
    };
    const mesh = e.addComponent(MeshComponent);
    mesh.color = new THREE.Color(0xffff00);
    const rb = e.addComponent(StaticRigidbodyComponent);
    const boxCollider = new BoxCollider();
    rb.addCollider(boxCollider);
  };

  const handleRedo = () => {
    if (!deerEngine) return;
    const cmdMgr = deerEngine.getManager(CommandManager);
    if (!cmdMgr) return;
    cmdMgr.redo();
  };

  const handleUndo = () => {
    if (!deerEngine) return;
    const cmdMgr = deerEngine.getManager(CommandManager);
    if (!cmdMgr) return;
    cmdMgr.undo();
  };

  const logSceneNode = () => {
    if (!deerEngine) return;
    console.log(deerEngine.getManager(SceneManager).mainScene?._rootEntities);
  };

  const handleRunEngine = () => {
    if (!deerEngine) return;
    // deerEngine.resume();
    setIsRunning(true);
  };

  const handlePauseEngine = () => {
    if (!deerEngine) return;
    // deerEngine.pause();
    setIsRunning(false);
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
              onSelect={handleCreateCCT}
            >
              New Character
            </Menubar.Item>
            <Menubar.Item
              className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400"
              onSelect={handleCreateFloor}
            >
              New Floor
            </Menubar.Item>
            <Menubar.Item
              className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400"
              onSelect={handleCreateCube}
            >
              New Cube
            </Menubar.Item>
            <Menubar.Separator className="h-[1px] bg-slate-400 m-[5px]" />
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="text-sm py-2 px-3 outline-none select-none leading-none rounded  flex items-center justify-between">
          Asset
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[220px] bg-gray-300 rounded-md p-1"
            align="start"
            sideOffset={5}
            alignOffset={-3}
          >
            <Menubar.Item className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400">
              <FileUpload onFileSelected={handleUploadFile}>
                <div>Select file</div>
              </FileUpload>
            </Menubar.Item>
            <Menubar.Separator className="h-[1px] bg-slate-400 m-[5px]" />
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="text-sm py-2 px-3 outline-none select-none leading-none rounded  flex items-center justify-between">
          Debug
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
              onSelect={logSceneNode}
            >
              LogSceneNode
            </Menubar.Item>
            <Menubar.Item
              className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400"
              onSelect={() => {
                console.log(scene?.physicsScene);
              }}
            >
              LogPhysicsScene
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>

      <Menubar.Menu>
        <Menubar.Trigger className="text-sm py-2 px-3 outline-none select-none leading-none rounded  flex items-center justify-between">
          Run
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
              onSelect={handleRunEngine}
              disabled={isRunning}
            >
              Play
            </Menubar.Item>
            <Menubar.Item
              className="text-sm group rounded flex items-center h-6 px-3 relative select-none outline-none hover:text-white hover:bg-blue-400"
              onSelect={handlePauseEngine}
              disabled={!isRunning}
            >
              Pause
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};
