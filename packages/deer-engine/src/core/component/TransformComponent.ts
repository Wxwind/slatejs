import { Object3D } from 'three';
import { ComponentBase } from './Component';
import { TransformCompJson } from './type';
import { Entity } from '../entity';
import { DeerScene } from '../DeerScene';

export class TransformComponent extends ComponentBase<'Transform'> {
  type = 'Transform' as const;

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

  toJsonObject: () => TransformCompJson = () => {
    return {
      position: this.rootObj.position.clone(),
      rotation: this.rootObj.rotation.clone(),
      scale: this.rootObj.scale.clone(),
    };
  };
}
