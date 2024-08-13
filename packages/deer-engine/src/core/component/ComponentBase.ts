import { UUID_PREFIX_COMP } from '@/config';
import { genUUID } from '@/util/utils';
import { ComponentData, ComponentType, ComponentTypeToJsonObjMap } from './type';
import { Entity, IBehaviour } from '../entity';
import { Signal } from 'eventtool';
import { property } from '../decorator';
import { ISerializable } from '@/interface';
import { Object3D } from 'three';

export abstract class ComponentBase<T extends ComponentType = ComponentType>
  implements ISerializable<ComponentData<T>>, IBehaviour
{
  @property({ type: String })
  public id: string;

  public abstract readonly type: T; // equals class' name

  protected _owner!: Entity;

  get owner(): Entity {
    return this._owner;
  }

  set owner(value: Entity) {
    this._owner = value;
  }

  get sceneObject(): Object3D {
    return this._owner.sceneObject;
  }

  public abstract get isCanBeRemoved(): boolean;

  signals = {
    componentUpdated: new Signal(),
  };

  constructor() {
    this.id = genUUID(UUID_PREFIX_COMP);
  }

  abstract update: (dt: number) => void;

  abstract awake: () => void;

  abstract destory: () => void;

  abstract updateByJson: (data: ComponentTypeToJsonObjMap[T]) => void;

  abstract onSerialize: () => ComponentTypeToJsonObjMap[T];

  abstract onDeserialize: (data: ComponentTypeToJsonObjMap[T]) => void;

  serialize: () => ComponentData<T> = () => {
    return {
      id: this.id,
      type: this.type,
      config: this.onSerialize(),
    } as ComponentData<T>;
  };

  deserialize = (data: ComponentData<T>) => {
    if (data.type !== this.type) {
      throw new Error(`Parse component error, required ${this.type} but received ${data.type}`);
    }
    this.id = data.id;
    this.onDeserialize(data.config);
  };
}
