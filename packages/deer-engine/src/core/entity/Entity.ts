import { isNil } from '@/util';
import { TransformComponent } from '../component';
import { genUUID } from '@/util/utils';
import { UUID_PREFIX_ENTITY } from '@/config';
import { DeerScene } from '../DeerScene';
import { EntityInfo } from './type';
import { Component, ComponentData } from '../component/type';

export class Entity {
  id: string;
  name: string;
  private readonly compMap = new Map<string, Component>();
  private readonly compArray: Component[] = [];

  public readonly rootComp: TransformComponent;

  constructor(name: string, parent: TransformComponent | DeerScene) {
    this.id = genUUID(UUID_PREFIX_ENTITY);
    const transformComp = new TransformComponent();
    transformComp.entity = this;
    transformComp.parent = parent;
    this.addComponent(transformComp);
    this.rootComp = transformComp;
    this.name = name;
  }

  getCompArray = () => this.compArray;

  addComponentByNew = <T extends Component>(compCtor: new () => T) => {
    const comp = new compCtor();
    comp.entity = this;
    this.compMap.set(comp.id, comp);
    this.compArray.push(comp);
  };

  addComponent = (comp: Component) => {
    this.compMap.set(comp.id, comp);
    this.compArray.push(comp);
  };

  hasComponent = <T extends Component>(type: T['type']) => {
    const c = this.compArray.find((a) => a.type === type);
    return !isNil(c);
  };

  findComponentById = (compId: string) => {
    return this.compMap.get(compId);
  };

  findComponentByType = <T extends Component>(type: T['type']): T | undefined => {
    const c = this.compArray.find((a) => a.type === type);
    return c as T | undefined;
  };

  removeComponentById = (id: string) => {
    const index = this.compArray.findIndex((a) => a.id === id);

    if (index === -1) {
      console.error(`component (compId = ${id}) not exist`);
      return;
    }

    const comp = this.compArray[index];
    if (!comp.isCanBeRemoved) {
      console.log(`${comp.id} couldn't be removed`);
      return;
    }

    this.compMap.delete(id);
    this.compArray.splice(index, 1);
    comp.onDestory();
  };

  removeComponent = (comp: Component) => {
    const index = this.compArray.findIndex((a) => a === comp);
    if (index === -1) {
      console.error(`component (compId = ${comp.id}) not exist`);
      return;
    }

    if (!comp.isCanBeRemoved) {
      console.log(`${comp.id} couldn't be removed`);
      return;
    }

    this.compMap.delete(comp.id);
    this.compArray.splice(index, 1);
    comp.onDestory();
  };

  onDestory = () => {
    for (const c of this.compArray) {
      if (c === this.rootComp) {
        continue;
      }
      c.onDestory();
    }
    this.rootComp.onDestory();

    this.compMap.clear();
    this.compArray.length = 0;
  };

  toJsonObject: () => EntityInfo = () => {
    const comps = this.compArray.map((a) => {
      return {
        id: a.id,
        type: a.type,
        config: a.toJsonObject(),
      } as ComponentData;
    });

    const info: EntityInfo = {
      id: this.id,
      name: this.name,
      components: comps,
    };
    return info;
  };
}
