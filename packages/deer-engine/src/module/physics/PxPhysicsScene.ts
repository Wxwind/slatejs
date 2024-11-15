import PhysX from 'physx-js-webidl';
import { PxPhysics } from './PxPhysics';
import { Vector3 } from 'three';
import { PxPhysicsRigidBody } from './PxPhysicsRigidBody';
import { PxPhysicsCharacterController } from './PxPhysicsCharacterController';
import { IVector3 } from '@/type';
import { ICharacterController, IPhysicsScene } from '@/core/physics/interface';

/** wrapper of PxPhysicsScene */
export class PxPhysicsScene implements IPhysicsScene {
  private _pxScene: PhysX.PxScene;
  _pxPhysics: PhysX.PxPhysics;
  _pxControllerManager: PhysX.PxControllerManager;
  _px: typeof PhysX & typeof PhysX.PxTopLevelFunctions;

  constructor(
    pxPhysics: PxPhysics,
    gravity: IVector3,
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

    const g = new px.PxVec3(gravity.x, gravity.y, gravity.z);
    const sceneDesc = new px.PxSceneDesc(nativePxPhysics.getTolerancesScale());
    sceneDesc.gravity = g;
    // A CpuDispatcher is responsible for scheduling the execution of tasks passed to it by the SDK.
    // 0 means no worker thread are initialized and simulation tasks will be executed on the thread that calls PxScene::simulate()
    sceneDesc.cpuDispatcher = px.DefaultCpuDispatcherCreate(0);
    // The custom filter shader to use for collision filtering.
    sceneDesc.filterShader = px.DefaultFilterShader();
    const scene = nativePxPhysics.createScene(sceneDesc);
    this._pxScene = scene;
    this._pxControllerManager = px.CreateControllerManager(scene);
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

  addRigidbody(rb: PxPhysicsRigidBody) {
    this._pxScene.addActor(rb._pxRigidBody);
  }

  removeRigidbody(rb: PxPhysicsRigidBody) {
    this._pxScene.removeActor(rb._pxRigidBody);
  }

  createCharacterController(): ICharacterController {
    const controller = new PxPhysicsCharacterController(this);
    return controller;
  }

  setGravity(gravity: Vector3) {
    this._pxScene.setGravity(new this._px.PxVec3(gravity.x, gravity.y, gravity.z));
  }

  destroy() {
    this._pxScene.release();
  }
}
