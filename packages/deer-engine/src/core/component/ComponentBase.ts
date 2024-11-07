import { UUID_PREFIX_COMP } from '@/config';
import { genUUID } from '@/util';
import { ComponentData, ComponentType, ComponentTypeToJsonObjMap } from './type';
import { Entity } from '../entity';
import { Signal } from 'eventtool';
import { property } from '../decorator';
import { ISerializable } from '@/interface';
import { Object3D } from 'three';
import { SceneObject } from '../base';

export abstract class ComponentBase<T extends ComponentType = ComponentType>
  extends SceneObject
  implements ISerializable<ComponentData<T>>
{
  /** @internal */
  _onStartIndex: number = -1;

  /** @internal */
  _onUpdateIndex: number = -1;

  /** @internal */
  _onFixedUpdateIndex: number = -1;

  /** @internal */
  _isDestroyed = false;

  _isAwoken = false;
  _isStarted = false;

  @property({ type: String })
  public id: string;

  public abstract readonly type: T; // equals class' name

  protected _entity: Entity;

  get entity(): Entity {
    return this._entity;
  }

  set entity(value: Entity) {
    this._entity = value;
  }

  get sceneObject(): Object3D {
    return this._entity.sceneObject;
  }

  // actual active, only true when this._enabled && entity._activeInScene.
  private _active = false;

  /**
   * Whether this component is enabled (like local active in entity).
   */
  @property({ type: Boolean })
  private _enabled = false;

  public get enabled() {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    if (value !== this._enabled) {
      this._enabled = value;
      if (this._entity._activeInScene) {
        // _active only depend on value because entity._activeInScene is true
        if (value !== this._active) {
          this._active = value;
          value ? this._onEnable() : this._onDisable();
        }
      }
    }
  }

  signals = {
    componentUpdated: new Signal(),
  };

  constructor(entity: Entity) {
    super(entity.scene);
    this._entity = entity;
    this.id = genUUID(UUID_PREFIX_COMP);
  }

  _setActive(value: boolean) {
    if (value) {
      if (!this._isAwoken && this.entity._activeInScene) {
        this._isAwoken = true;
        this._onAwake();
      }

      if (!this._active && this.entity._activeInScene && this._enabled) {
        this._active = true;
        this._onEnable();
      }
    } else {
      if (this._active && !this.entity._activeInScene && !this._enabled) {
        this._active = false;
        this._onDisable();
      }
    }
  }

  /** called when created, only once */
  _onAwake() {}

  /** called at the begin of frame rendering loop, only once */
  _onStart() {}

  _onEnable() {}

  _onDisable() {}

  destroy = () => {
    if (this._isDestroyed) return;
    this._isDestroyed = true;
    if (this._enabled) {
      this.entity._activeInScene && this._onDisable();
    }
    this._onDestroy();
  };

  _onDestroy() {}

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
