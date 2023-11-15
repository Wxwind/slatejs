import { UUID_PREFIX_COMP } from '@/config';
import { genUUID } from '@/util/utils';
import { ComponentType } from './type';
import { Object3D } from 'three';
import { Entity } from '../entity';

export abstract class Component {
  public readonly id: string;

  public abstract readonly type: ComponentType;

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
}
