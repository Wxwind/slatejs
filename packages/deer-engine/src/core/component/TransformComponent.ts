import { Object3D } from 'three';
import { Component } from './Component';
import { ComponentType } from './type';
import { Entity } from '../entity';
import { DeerScene } from '../DeerScene';

export class TransformComponent extends Component {
  type: ComponentType = 'Transform';
  rootObj: Object3D;
  parent: TransformComponent | DeerScene;

  children: TransformComponent[] = [];

  public get isCanBeRemoved(): boolean {
    return false;
  }

  constructor(entity: Entity, parent: TransformComponent | DeerScene) {
    super(entity);

    const emptyObj = new Object3D();
    this.rootObj = emptyObj;

    parent.addChild(this);
    this.parent = parent;
  }

  getChildren: () => TransformComponent[] = () => {
    return this.children;
  };

  addChild: (child: TransformComponent) => void = (child) => {
    this.children.push(child);
    this.rootObj.add(child.rootObj);
  };

  removeChild: (child: TransformComponent) => void = (child) => {
    const a = this.children.findIndex((a) => a === child);
    if (a === -1) {
      return;
    }
    this.children.splice(a, 1);
    this.rootObj.remove(child.rootObj);
  };

  onDestory: () => void = () => {
    for (const c of this.children) {
      c.entity.onDestory();
    }
    this.rootObj.clear();
  };
}
