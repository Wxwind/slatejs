import { Entity, Fsm } from 'deer-engine';
import { ColliderToolType } from '../type';
import { BoxColliderCreator } from './Creator/BoxColliderCreator';
import { ColliderToolBase } from './Creator/ColliderCreatorBase';
import { CapsuleColliderCreator } from './Creator/CapsuleColliderCreator';
import { SphereColliderCreator } from './Creator/SphereColliderCreator';
import { ColliderEditTool } from './ObjectEditHelper/ColliderEditTool';
import * as Mobx from 'mobx';

export class ColliderEditor {
  private toolClassMap = new Map<ColliderToolType, new () => ColliderToolBase>();
  private toolMap = new Map<ColliderToolType, ColliderToolBase>();

  // 要和startEdit的处初始状态匹配
  toolType: ColliderToolType = 'Edit';

  private fsm: Fsm<ColliderEditor> | undefined;

  constructor(public entity: Entity) {
    Mobx.makeObservable(this, {
      toolType: Mobx.observable,

      setToolType: Mobx.action,
    });
  }

  startEdit() {
    this.fsm = this.createFsm();
    this.fsm.start(ColliderEditTool);
    //  this.entity.scene.getManager(SelectManager)?.transformControls.setVisible(false);
  }

  endEdit() {
    if (!this.fsm) {
      throw new Error('endEdit: fsm还未被创建');
    }
    this.fsm.destroy();
    this.fsm = null!;
    //  this.entity.scene.getManager(SelectManager)?.transformControls.setVisible(true);
    this.toolType = 'Edit';
  }

  private createFsm() {
    const boxCreator = new BoxColliderCreator();
    const capsuleCreator = new CapsuleColliderCreator();
    const sphereCreator = new SphereColliderCreator();
    const colliderEditTool = new ColliderEditTool();
    const fsm = new Fsm(this, [boxCreator, capsuleCreator, sphereCreator, colliderEditTool]);
    this.registerColliderCreator(boxCreator);
    this.registerColliderCreator(capsuleCreator);
    this.registerColliderCreator(sphereCreator);
    this.registerColliderCreator(colliderEditTool);
    return fsm;
  }

  setToolType(toolType: ColliderToolType) {
    if (this.toolType !== toolType) {
      this.toolType = toolType;
      const state = this.toolClassMap.get(toolType);
      state && this.fsm!.switchState(state);
    }
  }

  getTool(toolType: ColliderToolType) {
    return this.toolMap.get(toolType);
  }

  private registerColliderCreator(creator: ColliderToolBase) {
    this.toolClassMap.set(creator.name, creator.constructor as new () => ColliderToolBase);
    this.toolMap.set(creator.name, creator);
  }

  update(dt: number) {
    this.fsm?.update(dt);
  }

  destroy() {
    this.fsm?.destroy();
  }
}
