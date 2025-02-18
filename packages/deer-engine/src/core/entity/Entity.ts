import { isNil, deserializeComponent, genUUID } from '@/util';
import { Component, TransformComponent } from '../component';
import { UUID_PREFIX_ENTITY } from '@/config';
import { EntityJson } from './type';

import { property } from '../decorator';
import { ISerializable } from '@/interface';
import { DeerScene } from '../DeerScene';
import { Object3D } from 'three';
import { EngineObject } from '../base';
import { Script } from '../component/Script';
import { DisorderedArray } from '../DisorderedMap';

export class Entity extends EngineObject implements ISerializable<EntityJson> {
  @property({ type: String })
  id: string = '0';

  @property({ type: String })
  name: string = '';

  sceneObject: Object3D;

  _isRoot = false;

  protected _scene: DeerScene;

  public get scene(): DeerScene {
    return this._scene;
  }

  /** local active */
  @property({ type: Boolean })
  _active = true;
  /** global active (actual active) */
  _activeInScene = false;

  private _destroyed = false;

  public get active() {
    return this._active;
  }

  public set active(v: boolean) {
    if (v !== this._active) {
      this._active = v;
      this.sceneObject.visible = v || false;
      if (v) {
        const parent = this.parent;
        let activeInScene = false;
        if (this._isRoot && this.scene.active) {
          activeInScene = true;
        } else {
          // v is true so activeInScene depends on parent's global active.
          activeInScene = parent?._activeInScene || false;
        }
        // process children's active since global active is trigged to true
        activeInScene && this._processActive();
      } else {
        // process children's inactive since global active is trigged to false
        this._activeInScene && this._processInActive();
      }
    }
  }

  _visible = true;

  private _parent: Entity | undefined;

  public get parent(): Entity | undefined {
    return this._parent;
  }

  public set parent(parent: Entity | undefined) {
    if (parent === this.parent) return;
    if (this._parent !== undefined) {
      if (parent && this._parent.scene !== parent.scene) {
        console.warn('cannot move component between scenes.');
        return;
      }
    }

    this._parent = parent;
    if (parent) {
      parent._addToChildren(this);

      this._isRoot = false;
      if (parent) {
        // inactive if parent is inactive in global and this is active in global
        if (!parent._activeInScene && this._activeInScene) {
          this._processInActive();
        }

        // active if this is active in local but inactive in global, and new parent is active in global
        if (parent._activeInScene && !this._activeInScene && this.active) {
          this._processActive();
        }
      }
    } else {
      this._processInActive();
    }
  }

  public readonly transform: TransformComponent;

  public readonly children: Entity[] = [];

  private readonly compMap = new Map<string, Component>();

  private readonly compArray: Component[] = [];

  private _activeChangedComponents: Component[] | null = null;

  _scripts: DisorderedArray<Script> = new DisorderedArray<Script>();

  constructor(scene: DeerScene) {
    super(scene.engine);
    this._scene = scene;
    this.id = genUUID(UUID_PREFIX_ENTITY);
    const transformComp = new TransformComponent(this);
    this._addComponent(transformComp);
    this.transform = transformComp;
    this.sceneObject = new Object3D();
  }

  _processActive() {
    if (this._activeChangedComponents) {
      throw new Error(
        "Note: can't set the 'main inActive entity' active in hierarchy, if the operation is in main inActive entity or it's children script's onDisable Event."
      );
    }

    // active all enabled components
    this._activeChangedComponents = [];
    this._setActiveInScene(this._activeChangedComponents);
    this._setActiveComponents(true, this._activeChangedComponents);
  }

  private _setActiveInScene(activeChangedComponent: Component[]) {
    this._activeInScene = true;
    const components = this.compArray;
    for (let i = 0, n = components.length; i < n; i++) {
      const comp = components[i];
      // comp.awake is triggered even if comp is disabled
      (comp.enabled || !comp._isAwoken) && activeChangedComponent.push(comp);
    }

    for (const child of this.children) {
      // active the child which active in local but inactive in scene.
      child._active && child._setActiveInScene(activeChangedComponent);
    }
  }

  _processInActive() {
    if (this._activeChangedComponents) {
      throw "Note: can't set the 'main active entity' inActive in hierarchy, if the operation is in main active entity or it's children script's onEnable Event.";
    }

    // inactive all enabled components
    this._activeChangedComponents = [];
    this._setInActiveInScene(this._activeChangedComponents);
    this._setActiveComponents(false, this._activeChangedComponents);
  }

  private _setInActiveInScene(activeChangedComponent: Component[]) {
    this._activeInScene = false;
    const components = this.compArray;
    for (let i = 0, n = components.length; i < n; i++) {
      const comp = components[i];
      comp.enabled && activeChangedComponent.push(comp);
    }

    for (const child of this.children) {
      // inActive the child which active in local (active in global too since this entity is trigged from global active to global inactive).
      child._active && child._setInActiveInScene(activeChangedComponent);
    }
  }

  private _setActiveComponents(active: boolean, components: Component[]) {
    for (let i = 0, n = components.length; i < n; i++) {
      const component = components[i];
      component._setActive(active);
    }

    this._activeChangedComponents = null;
  }

  getCompArray = () => this.compArray;

  addComponent = <T extends Component>(compCtor: new (entity: Entity) => T) => {
    const comp = new compCtor(this);
    comp._setActive(true);

    this.compMap.set(comp.id, comp);
    this.compArray.push(comp);
    return comp;
  };

  _addComponent = (comp: Component) => {
    comp._setActive(true);
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

    this.compMap.delete(comp.id);
    this.compArray.splice(index, 1);
    comp.destroy();
  };

  _addScript(script: Script) {
    script._entityScriptsIndex = this._scripts.length;
    this._scripts.add(script);
  }

  _removeScript(script: Script): void {
    const replaced = this._scripts.deleteByIndex(script._entityScriptsIndex);
    replaced && (replaced._entityScriptsIndex = script._entityScriptsIndex);
    script._entityScriptsIndex = -1;
  }

  getChildren: () => Entity[] = () => {
    return this.children;
  };

  addChild = (child: Entity) => {
    child.parent = this;
  };

  removeChild = (child: Entity) => {
    child.parent = undefined;
  };

  _addToChildren: (child: Entity) => void = (child) => {
    this.children.push(child);
    this.sceneObject.add(child.sceneObject);
  };

  _removeFromChildren: (child: Entity) => void = (child) => {
    const a = this.children.findIndex((a) => a === child);
    if (a === -1) {
      return;
    }
    this.children.splice(a, 1);
    this.sceneObject.remove(child.sceneObject);
  };

  destroy = () => {
    if (this._destroyed) return;

    for (const c of this.compArray) {
      c.destroy();
    }
    this.compMap.clear();
    this.compArray.length = 0;

    const children = this.children;
    while (children.length > 0) {
      children[0].destroy();
    }

    if (this._isRoot) {
      this._scene.removeRootEntity(this);
    } else {
      this.parent = undefined;
    }

    this.active = false;
    this._destroyed = true;
  };

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
      this._addComponent(comp);
    }
    for (const childData of data.children) {
      const entity = new Entity(this.scene);
      entity.deserialize(childData);
      entity.parent = this;
    }
  };
}
