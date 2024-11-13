import PhysX from 'physx-js-webidl';
import { PxPhysics } from './PxPhysics';
import { Vector3 } from 'three';
import { PxPhysicsRigidBody } from './PxPhysicsRigidBody';

/** wrapper of  PxPhysicsScene*/
export class PxPhysicsScene {
  _pxScene: PhysX.PxScene;
  _pxPhysics: PhysX.PxPhysics;
  _px: typeof PhysX & typeof PhysX.PxTopLevelFunctions;

  constructor(
    pxPhysics: PxPhysics,
    onContactBegin?: (obj1: number, obj2: number) => void,
    onContactEnd?: (obj1: number, obj2: number) => void,
    onContactStay?: (obj1: number, obj2: number) => void,
    onTriggerBegin?: (obj1: number, obj2: number) => void,
    onTriggerEnd?: (obj1: number, obj2: number) => void,
    onTriggerStay?: (obj1: number, obj2: number) => void
  ) {
    const nativePxPhysics = pxPhysics._pxPhysics;
    this._pxPhysics = nativePxPhysics;
    const px = pxPhysics._physX;
    this._px = px;

    const gravity = new px.PxVec3(0, -9.81, 0);
    const sceneDesc = new px.PxSceneDesc(nativePxPhysics.getTolerancesScale());
    sceneDesc.gravity = gravity;
    // A CpuDispatcher is responsible for scheduling the execution of tasks passed to it by the SDK.
    // 0 means no worker thread are initialized and simulation tasks will be executed on the thread that calls PxScene::simulate()
    sceneDesc.cpuDispatcher = px.DefaultCpuDispatcherCreate(0);
    // The custom filter shader to use for collision filtering.
    sceneDesc.filterShader = px.DefaultFilterShader();
    this._pxScene = nativePxPhysics.createScene(sceneDesc);
  }

  private simulate(deltaTime: number) {
    this._pxScene.simulate(deltaTime);
  }

  /**
   * Check to see if the simulation run has completed and fire appropriate callbacks if fetched.
   * @param block When set to true will block until the condition is met.
   */
  private fetchResult(block = true) {
    this._pxScene.fetchResults(block);
  }

  update(deltaTime: number) {
    this.simulate(deltaTime);
    this.fetchResult();
  }

  addActor(rb: PxPhysicsRigidBody) {
    this._pxScene.addActor(rb._pxRigidBody);
  }

  removeActor(rb: PxPhysicsRigidBody) {
    this._pxScene.removeActor(rb._pxRigidBody);
  }

  setGravity(gravity: Vector3) {
    this._pxScene.setGravity(new this._px.PxVec3(gravity.x, gravity.y, gravity.z));
  }

  destroy() {
    this._pxScene.release();
  }
}
