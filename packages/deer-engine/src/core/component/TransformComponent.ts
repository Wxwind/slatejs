import { Object3D, Vector3 } from 'three';
import { ComponentBase } from './ComponentBase';
import { TransformCompJson, IVector3 } from './type';
import { Entity } from '../entity';
import { DeerScene } from '../DeerScene';
import { accessor, egclass } from '../data';

@egclass()
export class TransformComponent extends ComponentBase<'TransformComponent'> {
  type = 'TransformComponent' as const;

  rootObj: Object3D;
  parent: TransformComponent | DeerScene;

  children: TransformComponent[] = [];

  public get isCanBeRemoved(): boolean {
    return false;
  }

  @accessor({ type: IVector3 })
  public get position(): IVector3 {
    return this.rootObj.position;
  }

  @accessor({ type: IVector3 })
  public set position(v: IVector3) {
    console.log(
      '设置位置%o给%s,%s,%s',
      JSON.stringify(v),
      this.rootObj.position.x,
      this.rootObj.position.y,
      this.rootObj.position.z
    );

    this.rootObj.position.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  @accessor({ type: IVector3 })
  public get rotation(): IVector3 {
    return new Vector3(this.rootObj.rotation.x, this.rootObj.rotation.y, this.rootObj.rotation.z);
  }

  @accessor({ type: IVector3 })
  public set rotation(v: IVector3) {
    this.rootObj.rotation.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  @accessor({ type: IVector3 })
  public get scale(): IVector3 {
    return this.rootObj.scale;
  }

  @accessor({ type: IVector3 })
  public set scale(v: IVector3) {
    this.rootObj.scale.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
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

  updateByJson: (data: TransformCompJson) => void = (data) => {
    this.rootObj.position.set(data.position.x, data.position.y, data.position.z);
    this.rootObj.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    this.rootObj.scale.set(data.scale.x, data.scale.y, data.scale.z);
    this.signals.componentUpdated.emit();
  };

  toJsonObject: () => TransformCompJson = () => {
    return {
      position: this.rootObj.position.clone(),
      rotation: this.rootObj.rotation.clone(),
      scale: this.rootObj.scale.clone(),
    };
  };
}
