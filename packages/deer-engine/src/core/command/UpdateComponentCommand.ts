import { ICommand } from '@/packages/command';
import { DeerScene } from '../DeerScene';
import { CommandType } from './type';
import { Component } from '../component';
import { isNil } from '@/util';
import { JsonModule } from '../decorator';

export class UpdateComponentCommand implements ICommand {
  type: CommandType = 'UpdateComponent';
  oldCompConfig: any | undefined;

  constructor(
    private scene: DeerScene,
    private entityId: string,
    private compId: string,
    private compInfo: any
  ) {}

  execute: () => boolean = () => {
    const entity = this.scene.entityManager.findEntityById(this.entityId);
    const comp = entity?.findComponentById(this.compId);
    if (isNil(comp)) {
      return false;
    }
    if (comp.type === this.compInfo.type) {
      const c = comp as Component;
      this.oldCompConfig = JsonModule.toJsonObject(c);
      c.updateByJson(this.compInfo.config, true);
      return true;
    } else {
      throw new Error(`cannot assign config of <${this.compInfo.type}> to comp of <${comp.type}>`);
    }
  };

  undo: () => boolean = () => {
    if (isNil(this.oldCompConfig)) {
      return false;
    }

    const entity = this.scene.entityManager.findEntityById(this.entityId);
    const comp = entity?.findComponentById(this.compId);
    if (isNil(comp)) {
      return false;
    }
    if (comp.type === this.compInfo.type) {
      const c = comp as Component;
      c.updateByJson(this.oldCompConfig, true);
      return true;
    } else {
      throw new Error(`cannot assign config of <${this.oldCompConfig}> to comp of <${comp.type}>`);
    }
  };

  toString: () => string = () => {
    return `${this.type}Command: entityId = ${this.entityId}, compId = ${this.compId}, oldCompConfig = ${
      this.oldCompConfig || '<missing>'
    }`;
  };
}
