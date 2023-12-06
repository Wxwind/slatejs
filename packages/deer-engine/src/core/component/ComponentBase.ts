import { UUID_PREFIX_COMP } from '@/config';
import { genUUID } from '@/util/utils';
import { ComponentType, ComponentTypeToJsonObjMap } from './type';
import { Entity } from '../entity';

export abstract class ComponentBase<T extends ComponentType = ComponentType> {
  public readonly id: string;

  public abstract readonly type: T;

  protected _entity: Entity;

  public get entity(): Entity {
    return this._entity;
  }

  public abstract get isCanBeRemoved(): boolean;

  constructor(entity: Entity) {
    this._entity = entity;
    this.id = genUUID(UUID_PREFIX_COMP);
  }

  abstract onDestory: () => void;

  abstract updateByJson: (data: ComponentTypeToJsonObjMap[T]) => void;

  abstract toJsonObject: () => ComponentTypeToJsonObjMap[T];
}
