import { isNil, deserializeComponent, genUUID } from '@/util';
import { TransformComponent } from '../component';
import { UUID_PREFIX_ENTITY } from '@/config';
import { EntityJson } from './type';
import { Component } from '../component/type';
import { property } from '../decorator';
import { ISerializable } from '@/interface';
import { DeerScene } from '../DeerScene';
import { Scene, Object3D } from 'three';
import { SceneObject } from '../base';

export class Entity extends SceneObject implements ISerializable<EntityJson> {
  @property({ type: String })
  id: string = '0';

  @property({ type: String })
  name: string = '';

  sceneObject: Object3D;

  isRoot = false;

  @property({ type: Boolean })
  active = false;

  private _parent: Entity | undefined;

  public get parent(): Entity | undefined {
    return this._parent;
  }

  public set parent(v: Entity | undefined) {
    if (v === this.parent) return;
    if (this._parent !== undefined) {
      if (v && this._parent.scene !== v.scene) {
        console.warn('cannot move component between scenes');
        return;
      }
      this._parent.removeChild(this);
    }

    if (v !== undefined) {
      v.addChild(this);
      this._parent = v;
      this._scene = v._scene;
      this.isRoot = false;
    } else {
      this.scene.addRootEntity(this);
      this.isRoot === true;
    }
  }

  public readonly transform: TransformComponent;

  public readonly children: Entity[] = [];

  private readonly compMap = new Map<string, Component>();

  private readonly compArray: Component[] = [];

  constructor(scene: DeerScene) {
    super(scene);
    this.id = genUUID(UUID_PREFIX_ENTITY);
    const transformComp = new TransformComponent(this);
    transformComp.entity = this;
    this.addComponent(transformComp);
    this.transform = transformComp;
    this.sceneObject = new Object3D();
  }

  getCompArray = () => this.compArray;

  addComponentByNew = <T extends Component>(compCtor: new (entity: Entity) => T) => {
    const comp = new compCtor(this);
    comp.awake();
    this.compMap.set(comp.id, comp);
    this.compArray.push(comp);
    return comp;
  };

  addComponent = (comp: Component) => {
    comp.entity = this;
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
    comp.destroy();
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
    comp.destroy();
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

  update: (dt: number) => void = (dt) => {
    if (!this.active) return;
    const compArray = [...this.compArray];
    for (const comp of compArray) {
      comp.update(dt);
    }
    const children = [...this.children];
    for (const child of children) {
      child.update(dt);
    }
  };

  destroy = () => {
    for (const c of this.compArray) {
      if (c === this.transform) {
        continue;
      }
      c.destroy();
    }
    this.transform.destroy();

    this.compMap.clear();
    this.compArray.length = 0;
    this.onDestroy();
  };

  onDestroy = () => {};

  serialize: () => EntityJson = () => {
    const components = this.compArray.map((a) => a.serialize());
    const children = this.children.map((a) => a.serialize());

    const data: EntityJson = {
      id: this.id,
      name: this.name,
      components,
      children,
    };
    return data;
  };

  deserialize = (data: EntityJson) => {
    this.id = data.id;
    this.name = data.name;
    for (const compData of data.components) {
      const comp = deserializeComponent(compData, this);
      this.addComponent(comp);
    }
    for (const childData of data.children) {
      const entity = new Entity(this.scene);
      entity.deserialize(childData);
      entity.parent = this;
    }
  };
}
