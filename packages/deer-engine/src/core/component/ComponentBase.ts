import { UUID_PREFIX_COMP } from '@/config';
import { genUUID } from '@/util/utils';
import { ComponentType, ComponentTypeToJsonObjMap } from './type';
import { Entity } from '../entity';
import { Signal } from 'eventtool';
import { accessor, property } from '../data';

export abstract class ComponentBase<T extends ComponentType = ComponentType> {
  @property({ type: String })
  public id: string;

  public abstract readonly type: T; // equals class' name

  protected _entity: Entity | undefined;

  public get entity(): Entity | undefined {
    return this._entity;
  }

  public set entity(value: Entity | undefined) {
    this._entity = value;
  }

  public abstract get isCanBeRemoved(): boolean;

  signals = {
    componentUpdated: new Signal(),
  };

  constructor() {
    this.id = genUUID(UUID_PREFIX_COMP);
  }

  abstract onDestory: () => void;

  abstract updateByJson: (data: ComponentTypeToJsonObjMap[T]) => void;
}
