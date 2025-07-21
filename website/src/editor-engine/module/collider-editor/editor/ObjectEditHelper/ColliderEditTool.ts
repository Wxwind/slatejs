import { ColliderToolBase } from '../Creator/ColliderCreatorBase';
import { BoundingBox, Entity, Fsm, StaticRigidbodyComponent } from 'deer-engine';
import { IEditHelper } from './IEditHelper';
import { BoxEditHelper, CapsuleEditHelper, SphereEditHelper } from '.';
import { ColliderEditor } from '../ColliderEditor';
import { ColliderToolType } from '../../type';
import {
  BoxColliderObj,
  CapsuleColliderObj,
  ColliderObj,
  SphereColliderObj,
} from '@/editor-engine/module/three-collider';

export class ColliderEditTool extends ColliderToolBase {
  readonly name: ColliderToolType = 'Edit';

  editHelperMap: Record<string, IEditHelper> = {};

  // 类似子状态机
  _curEditorHelper: IEditHelper | null = null;

  boundingBox: BoundingBox = new BoundingBox();
  entity: Entity = null!;
  colliderObjSelectManager: ColliderObjSelectManager = null!;

  private registerHelper(entity: Entity, colliderObj: ColliderObj) {
    let helper: IEditHelper | undefined;
    if (colliderObj instanceof BoxColliderObj) {
      helper = new BoxEditHelper(entity, colliderObj);
    } else if (colliderObj instanceof SphereColliderObj) {
      helper = new SphereEditHelper(entity, colliderObj);
    } else if (colliderObj instanceof CapsuleColliderObj) {
      helper = new CapsuleEditHelper(entity, colliderObj);
    }

    if (helper) {
      this.editHelperMap[colliderObj.userId] = helper;
    }

    return helper;
  }

  private unRegisterHelper(colliderObj: ColliderObj) {
    const helper = this.editHelperMap[colliderObj.userId];
    if (!helper) return;

    if (this._curEditorHelper === helper) {
      helper.onLeave();
      helper.onDestroy();
    }
    delete this.editHelperMap[colliderObj.userId];
  }

  override onInit(fsm: Fsm<ColliderEditor>): void {
    this.entity = fsm.owner.entity;
  }

  override onEnter(fsm: Fsm<ColliderEditor>): void {
    const comp = fsm.owner.entity;
    const rigidbodyComponent = comp.rigidbodyComponent;
    const colliderObjs = rigidbodyComponent._colliderObjs;
    for (const colliderObj of colliderObjs) {
      this.registerHelper(comp, colliderObj);
    }

    rigidbodyComponent.signals.onColliderSelected.on(this.enterEditor);
    rigidbodyComponent.signals.onColliderAdded.on(this.handleColliderAdded);
    rigidbodyComponent.signals.onColliderRemoved.on(this.handleColliderRemoved);
    rigidbodyComponent.signals.onColliderUpdated.on(this.handleColliderUpdate);

    this.colliderObjSelectManager = new ColliderObjSelectManager(comp);
    this.colliderObjSelectManager.init();

    this.enterEditor(rigidbodyComponent.selectedColliderId);
  }

  override onUpdate(fsm: Fsm<ColliderEditor>, dt: number): void {
    this._curEditorHelper?.onUpdate(dt);
  }

  override onLeave(fsm: Fsm<ColliderEditor>): void {
    const comp = fsm.owner.entity;
    const rigidbodyComponent = comp.findComponentByType<StaticRigidbodyComponent>('StaticRigidbodyComponent');
    rigidbodyComponent.signals.onColliderSelected.off(this.enterEditor);
    rigidbodyComponent.signals.onColliderAdded.off(this.handleColliderAdded);
    rigidbodyComponent.signals.onColliderRemoved.off(this.handleColliderRemoved);
    if (this._curEditorHelper) {
      this._curEditorHelper.onLeave();
    }
    Object.values(this.editHelperMap).forEach((helper) => helper.onDestroy());

    this.editHelperMap = {};

    if (this.colliderObjSelectManager) {
      this.colliderObjSelectManager.destroy();
      this.colliderObjSelectManager = null!;
    }
  }

  enterEditor = (id: string | undefined) => {
    if (id === undefined) {
      if (this._curEditorHelper) {
        this._curEditorHelper.onLeave();
        this._curEditorHelper = null;
      }
      return;
    }

    const helper = this.editHelperMap[id];
    if (!helper) {
      return;
    }

    this._curEditorHelper?.onLeave();
    this._curEditorHelper = helper;
    helper.onEnter();

    const coll = this.entity.rigidbodyComponent._colliderObjs.find((a) => a.userId === id);
    if (!coll) return;
    this.colliderObjSelectManager.select([coll], false);
  };

  handleColliderAdded = (colliderObj: ColliderObj) => {
    this.registerHelper(this.entity, colliderObj);
  };

  handleColliderRemoved = (colliderObj: ColliderObj) => {
    this.unRegisterHelper(colliderObj);
  };

  handleColliderUpdate = (colliderObj: ColliderObj) => {
    // 配置面板更新完数据后应当更新控制点的位置
    if (this._curEditorHelper === this.editHelperMap[colliderObj.userId]) {
      this._curEditorHelper.updateControlPoints();
    }
  };
}
