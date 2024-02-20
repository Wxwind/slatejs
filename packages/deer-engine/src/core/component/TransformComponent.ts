import { Object3D, Vector3 } from 'three';
import { ComponentBase } from './ComponentBase';
import { TransformCompJson, FVector3 } from './type';
import { DeerScene } from '../DeerScene';
import { accessor, egclass } from '../data';

@egclass()
export class TransformComponent extends ComponentBase<'TransformComponent'> {
  type = 'TransformComponent' as const;

  rootObj: Object3D;

  private _parent: TransformComponent | DeerScene | undefined;

  public get parent(): TransformComponent | DeerScene | undefined {
    return this._parent;
  }

  public set parent(v: TransformComponent | DeerScene) {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    v.addChild(this);
    this._parent = v;
  }

  children: TransformComponent[] = [];

  public get isCanBeRemoved(): boolean {
    return false;
  }

  @accessor({ type: FVector3 })
  public get position(): FVector3 {
    return this.rootObj.position;
  }

  @accessor({ type: FVector3 })
  public set position(v: FVector3) {
    this.rootObj.position.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  @accessor({ type: FVector3 })
  public get rotation(): FVector3 {
    return new Vector3(this.rootObj.rotation.x, this.rootObj.rotation.y, this.rootObj.rotation.z);
  }

  @accessor({ type: FVector3 })
  public set rotation(v: FVector3) {
    this.rootObj.rotation.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  @accessor({ type: FVector3 })
  public get scale(): FVector3 {
    return this.rootObj.scale;
  }

  @accessor({ type: FVector3 })
  public set scale(v: FVector3) {
    this.rootObj.scale.set(v.x, v.y, v.z);
    this.signals.componentUpdated.emit();
  }

  constructor() {
    console.log('init base');
    super();

    const emptyObj = new Object3D();
    this.rootObj = emptyObj;
    console.log('init transform');
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
      c.entity?.onDestory();
    }
    this.rootObj.clear();
  };

  updateByJson: (data: TransformCompJson) => void = (data) => {
    this.rootObj.position.set(data.position.x, data.position.y, data.position.z);
    this.rootObj.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    this.rootObj.scale.set(data.scale.x, data.scale.y, data.scale.z);
    this.signals.componentUpdated.emit();
  };
}
