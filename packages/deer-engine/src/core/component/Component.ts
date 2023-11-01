import { UUID_PREFIX_COMP } from '@/config';
import { genUUID } from '@/util/utils';
import { ComponentType } from './type';
import { Object3D } from 'three';

export abstract class Component {
  id: string;
  parent: Object3D | null = null;
  abstract type: ComponentType;
  isCanBeRemoved: boolean = true;

  constructor() {
    this.id = genUUID(UUID_PREFIX_COMP);
  }

  abstract onDestory: () => void;
}
