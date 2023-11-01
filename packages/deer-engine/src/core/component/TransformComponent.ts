import { Object3D } from 'three';
import { Component } from './Component';
import { ComponentType } from './type';

export class TransformComponent extends Component {
  type: ComponentType = 'Transform';
  isCanBeRemoved = false;
  rootObj: Object3D;

  constructor(parent: Object3D) {
    super();
    const emptyObj = new Object3D();
    parent.add(emptyObj);

    this.rootObj = emptyObj;
    this.parent = parent;
  }

  onDestory: () => void = () => {};
}
