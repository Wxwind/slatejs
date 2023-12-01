import { isNil } from '@/util';
import { ComponentInfo, DeerScene, deerEngine } from '..';
import { SelectEntityCommand, DeleteEntityCommand, CreateEntityCommand, UpdateComponentCommand } from './command';

export class ApiCenter {
  constructor(public scene: DeerScene | undefined) {}

  createEntity = (parentId: string | null = null) => {
    if (isNil(this.scene)) return;
    const cmd = new CreateEntityCommand(this.scene, parentId, 'Object Cube');
    deerEngine.commandManager.execute(cmd);
  };

  deleteEntity = (entityId: string) => {
    if (isNil(this.scene)) return;
    const cmd = new DeleteEntityCommand(this.scene, entityId);
    deerEngine.commandManager.execute(cmd);
  };

  selecteEntity = (entityId: string) => {
    if (isNil(this.scene)) return;
    const cmd = new SelectEntityCommand(this.scene, entityId);
    deerEngine.commandManager.execute(cmd);
  };

  updateComponent = (entityId: string, compId: string, compInfo: ComponentInfo) => {
    if (isNil(this.scene)) return;
    const cmd = new UpdateComponentCommand(this.scene, entityId, compId, compInfo);
    deerEngine.commandManager.execute(cmd);
  };
}
