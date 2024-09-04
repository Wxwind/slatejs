import { UUID_PREFIX_COMP } from '@/config';
import { genUUID } from '@/util';
import { ComponentData, ComponentType, ComponentTypeToJsonObjMap } from './type';
import { Entity, IBehaviour } from '../entity';
import { Signal } from 'eventtool';
import { property } from '../decorator';
import { ISerializable } from '@/interface';
import { Object3D } from 'three';
import { SceneObject } from '../base';

export abstract class ComponentBase<T extends ComponentType = ComponentType>
  extends SceneObject
  implements ISerializable<ComponentData<T>>, IBehaviour
{
  @property({ type: String })
  public id: string;

  public abstract readonly type: T; // equals class' name

  protected _entity: Entity;

  protected _enabled = true;

  public get enabled() {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    if (this._enabled !== value) {
      this._enabled = value;
      value ? this.onEnabled() : this.onDisabled();
      this.signals.componentUpdated.emit();
    }
  }

  get entity(): Entity {
    return this._entity;
  }

  set entity(value: Entity) {
    this._entity = value;
  }

  get sceneObject(): Object3D {
    return this._entity.sceneObject;
  }

  public abstract get isCanBeRemoved(): boolean;

  signals = {
    componentUpdated: new Signal(),
  };

  constructor(entity: Entity) {
    super(entity.scene);
    this._entity = entity;
    this.id = genUUID(UUID_PREFIX_COMP);
  }

  awake(): void {
    if (this.enabled) {
      this.onEnabled();
    }
    this.onAwake();
  }

  onAwake() {}

  onEnabled() {}

  onDisabled() {}

  update(dt: number) {}

  destroy(): void {
    this.enabled = false;
    this.onDestroy();
  }

  onDestroy() {}

  abstract updateByJson(data: ComponentTypeToJsonObjMap[T], sync: boolean): void;

  abstract onSerialize(): ComponentTypeToJsonObjMap[T];

  abstract onDeserialize(data: ComponentTypeToJsonObjMap[T]): void;

  serialize(): ComponentData<T> {
    return {
      id: this.id,
      type: this.type,
      config: this.onSerialize(),
    } as ComponentData<T>;
  }

  deserialize(data: ComponentData<T>) {
    if (data.type !== this.type) {
      throw new Error(`Parse component error, required ${this.type} but received ${data.type}`);
    }
    this.id = data.id;
    this.onDeserialize(data.config);
  }
}
