import { UUID_PREFIX_COMP } from '@/config';
import { genUUID } from '@/util';
import { Entity } from '../entity';
import { Signal } from 'eventtool';
import { property } from '../decorator';
import { ISerializable } from '@/interface';
import { Object3D } from 'three';
import { EngineObject } from '../base';
import { ComponentType, ComponentData, ComponentTypeToJsonObjMap } from './type';
import { DeerScene } from '../DeerScene';

export abstract class ComponentBase<T extends ComponentType = ComponentType>
  extends EngineObject
  implements ISerializable<ComponentData<T>>
{
  /** @internal */
  _onStartIndex: number = -1;

  /** @internal */
  _onUpdateIndex: number = -1;

  /** @internal */
  _onFixedUpdateIndex: number = -1;

  _isAwoken = false;
  _isStarted = false;

  @property({ type: String })
  public id: string;

  public abstract readonly type: T; // equals class' name

  private _entity: Entity;

  get entity(): Entity {
    return this._entity;
  }

  public get scene(): DeerScene {
    return this._entity.scene;
  }

  get sceneObject(): Object3D {
    return this._entity.sceneObject;
  }

  /** actual active, only true when this._enabled && entity._activeInScene. */
  protected _active = false;

  /**
   * Whether this component is enabled (like local active in entity).
   */
  @property({ type: Boolean })
  private _enabled = true;

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
    super(entity.engine);
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

  _onEnable() {}

  _onDisable() {}

  override _onDestroy() {
    super._onDestroy();
    if (this._enabled) {
      this.entity._activeInScene && this._onDisable();
    }
  }

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
