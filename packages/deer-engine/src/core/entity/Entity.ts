import { isNil, deserializeComponent, genUUID } from '@/util';
import { TransformComponent } from '../component';
import { UUID_PREFIX_ENTITY } from '@/config';
import { EntityJson } from './type';
import { Component } from '../component/type';
import { property } from '../decorator';
import { ISerializable } from '@/interface';
import { IBehaviour } from './interface';
import { DeerScene } from '../DeerScene';
import { Scene, Object3D } from 'three';

export class Entity implements ISerializable<EntityJson>, IBehaviour {
  @property({ type: String })
  id: string = '0';

  @property({ type: String })
  name: string = '';

  sceneObject: Object3D;

  root: DeerScene | undefined;

  private _parent: Entity | undefined;

  public get parent(): Entity | undefined {
    return this._parent;
  }

  public set parent(v: Entity | undefined) {
    if (v! == this.parent) {
      this._parent?.removeChild(this);
    }
    if (v !== undefined) {
      v.addChild(this);
      this._parent = v;
      this.root = v.root;
    }
  }

  public readonly transform: TransformComponent;

  public readonly children: Entity[] = [];

  private readonly compMap = new Map<string, Component>();

  private readonly compArray: Component[] = [];

  constructor(isScene: boolean = false) {
    this.id = genUUID(UUID_PREFIX_ENTITY);
    const transformComp = new TransformComponent();
    transformComp.owner = this;
    this.addComponent(transformComp);
    this.transform = transformComp;
    isScene ? (this.sceneObject = new Scene()) : (this.sceneObject = new Object3D());
  }

  getCompArray = () => this.compArray;

  addComponentByNew = <T extends Component>(compCtor: new () => T) => {
    const comp = new compCtor();
    comp.owner = this;
    comp.awake();
    this.compMap.set(comp.id, comp);
    this.compArray.push(comp);
    return comp;
  };

  addComponent = (comp: Component) => {
    comp.owner = this;
    comp.awake();
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
    comp.destory();
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
    comp.destory();
  };

  getChildren: () => Entity[] = () => {
    return this.children;
  };

  addChild: (child: Entity) => void = (child) => {
    this.children.push(child);
    this.sceneObject.add(child.sceneObject);
  };

  removeChild: (child: Entity) => void = (child) => {
    const a = this.children.findIndex((a) => a === child);
    if (a === -1) {
      return;
    }
    this.children.splice(a, 1);
    this.sceneObject.remove(child.sceneObject);
  };

  awake: () => void = () => {};

  update: (dt: number) => void = (dt) => {
    for (const comp of this.compArray) {
      comp.update(dt);
    }
    for (const children of this.children) {
      children.update(dt);
    }
  };

  destory = () => {
    for (const c of this.compArray) {
      if (c === this.transform) {
        continue;
      }
      c.destory();
    }
    this.transform.destory();

    this.compMap.clear();
    this.compArray.length = 0;
  };

  serialize: () => EntityJson = () => {
    const comps = this.compArray.map((a) => a.serialize());

    const data: EntityJson = {
      id: this.id,
      parent: this.parent?.id,
      name: this.name,
      components: comps,
    };
    return data;
  };

  deserialize = (data: EntityJson) => {
    this.id = data.id;
    this.name = data.name;
    for (const compData of data.components) {
      const comp = deserializeComponent(compData);
      this.addComponent(comp);
    }
  };
}
