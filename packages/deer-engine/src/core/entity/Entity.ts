import { isNil } from '@/util';
import { Component, TransformComponent } from '../component';
import { genUUID } from '@/util/utils';
import { UUID_PREFIX_ENTITY } from '@/config';
import { Object3D } from 'three';

export class Entity {
  id: string;
  private readonly compMap = new Map<string, Component>();
  private readonly compArray: Component[] = [];

  get rootComp(): TransformComponent {
    return this.getComponentByType('Transform');
  }

  constructor(parent: Object3D) {
    this.id = genUUID(UUID_PREFIX_ENTITY);
    const transformComp = new TransformComponent(parent);
    this.addComponent(transformComp);
  }

  addComponentByNew = <T extends Component>(compCtor: new () => T) => {
    const comp = new compCtor();
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

  getComponentById = (compId: string) => {
    return this.compMap.get(compId);
  };

  getComponentByType = <T extends Component>(type: T['type']): T => {
    const c = this.compArray.find((a) => a.type === type);
    return c as T;
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
    this.compArray.forEach((a) => a.onDestory());
    this.compMap.clear();
    this.compArray.length = 0;
  };
}
