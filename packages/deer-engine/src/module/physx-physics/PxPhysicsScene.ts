import PhysX from 'physx-js-webidl';
import { PxPhysics } from './PxPhysics';
import { Vector3 } from 'three';
import { PxPhysicsRigidBody } from './PxPhysicsRigidBody';
import { PxPhysicsCharacterController } from './PxPhysicsCharacterController';
import { IVector3 } from '@/type';
import {
  InternalControllerColliderHit,
  ICharacterController,
  ICollider,
  IPhysicsScene,
  PhysicsEventCallbacks,
} from '@/core/physics/interface';
import { castPxObject, castPxPointer } from './pxExtensions';
import { SimpleObjectPool } from './eventPool';
import { DisorderedArray } from '@/core/DisorderedMap';
import { PxPhysicsBoxCollider, PxPhysicsCollider } from './collider';
import { toPxVec3 } from './utils';
import { HitResult } from '@/core/physics/HitResult';

enum TriggerState {
  None,
  Enter,
  Stay,
  Exit,
}

class TriggerEvent {
  _obj1: number = -1;
  _obj2: number = -1;

  triggerState: TriggerState = TriggerState.None;
}

/** wrapper of PxPhysicsScene */
export class PxPhysicsScene implements IPhysicsScene {
  private _pxScene: PhysX.PxScene;
  _pxPhysics: PhysX.PxPhysics;
  _pxControllerManager: PhysX.PxControllerManager;
  _px: typeof PhysX & typeof PhysX.PxTopLevelFunctions;

  // all created collider
  _pxColliderMap: Record<number, PxPhysicsCollider> = {};
  _pxControllerMap: Record<number, PxPhysicsCharacterController> = {};

  // map<shapeId, map<shapeId,event> >
  private _triggerEventTable: Record<number, Record<number, TriggerEvent>> = {};
  private _triggerEventPool = new SimpleObjectPool(TriggerEvent);
  // flat of _triggerEventTable
  private _currentEvents: DisorderedArray<TriggerEvent> = new DisorderedArray<TriggerEvent>();

  private _onTriggerBegin?: (obj1: number, obj2: number) => void;
  private _onTriggerEnd?: (obj1: number, obj2: number) => void;
  private _onTriggerStay?: (obj1: number, obj2: number) => void;
  _onCharacterControllerHit?: (characterController: number, hit: InternalControllerColliderHit) => void;

  private _tempVec1: PhysX.PxVec3;
  private _tempVec2: PhysX.PxVec3;
  private _raycastBuffer: PhysX.PxRaycastBuffer10;
  private _raycastFlags: PhysX.PxHitFlags;

  constructor(pxPhysics: PxPhysics, gravity: IVector3, eventCallbacks?: PhysicsEventCallbacks) {
    const nativePxPhysics = pxPhysics._pxPhysics;
    this._pxPhysics = nativePxPhysics;
    const px = pxPhysics._physX;
    this._px = px;
    this._tempVec1 = new px.PxVec3();
    this._tempVec2 = new px.PxVec3();
    this._raycastBuffer = new px.PxRaycastBuffer10();
    this._raycastFlags = new px.PxHitFlags(px.PxHitFlagEnum.eNORMAL | px.PxHitFlagEnum.ePOSITION);
    this._onTriggerBegin = eventCallbacks?.onTriggerBegin;
    this._onTriggerEnd = eventCallbacks?.onTriggerEnd;
    this._onTriggerStay = eventCallbacks?.onTriggerStay;
    this._onCharacterControllerHit = eventCallbacks?.onControllerHit;

    const g = new px.PxVec3(gravity.x, gravity.y, gravity.z);
    const sceneDesc = new px.PxSceneDesc(nativePxPhysics.getTolerancesScale());
    sceneDesc.gravity = g;
    // A CpuDispatcher is responsible for scheduling the execution of tasks passed to it by the SDK.
    // 0 means no worker thread are initialized and simulation tasks will be executed on the thread that calls PxScene::simulate()
    sceneDesc.cpuDispatcher = px.DefaultCpuDispatcherCreate(0);
    // The custom filter shader to use for collision filtering.
    sceneDesc.filterShader = px.TriggersUsingFilterShader();
    sceneDesc.kineKineFilteringMode = px.PxPairFilteringModeEnum.eKEEP;
    sceneDesc.staticKineFilteringMode = px.PxPairFilteringModeEnum.eKEEP;

    const simulationEventCallbackImpl = new px.PxSimulationEventCallbackImpl();

    simulationEventCallbackImpl.onContact = (pairHeaderPointer, pairsPointer, nbPairs) => {
      const px = this._px;
      // console.log(`onContact nbPairs:${nbPairs}`);

      const nativeArrayHelper = this._px.NativeArrayHelpers.prototype;
      for (let i = 0; i < nbPairs; i++) {
        const pair = nativeArrayHelper.getContactPairAt(pairsPointer, i);
        const event = pair.events;
        9;
        const nativeShape0 = (pair as any).get_shapes(0);
        const nativeShape1 = (pair as any).get_shapes(1);

        const isTriggerPair = px.IsTriggerShape(nativeShape0) || px.IsTriggerShape(nativeShape1);

        const shapeA = this._pxColliderMap[nativeShape0.ptr]?._id;
        const shapeB = this._pxColliderMap[nativeShape1.ptr]?._id;

        if (!shapeA || !shapeB) {
          console.error(`pxShape binding is null. ShapeA: ${nativeShape0} ShapeB: ${nativeShape1}`);
          return;
        }

        if (event.isSet(px.PxPairFlagEnum.eNOTIFY_TOUCH_FOUND)) {
          // console.log('begin contact', shapeA, shapeB);
          isTriggerPair
            ? eventCallbacks?.onTriggerBegin?.(shapeA, shapeB)
            : eventCallbacks?.onContactBegin?.(shapeA, shapeB);
        } else if (event.isSet(px.PxPairFlagEnum.eNOTIFY_TOUCH_LOST)) {
          // console.log('end contact', shapeA, shapeB);
          isTriggerPair
            ? eventCallbacks?.onTriggerEnd?.(shapeA, shapeB)
            : eventCallbacks?.onContactEnd?.(shapeA, shapeB);
        } else if (event.isSet(px.PxPairFlagEnum.eNOTIFY_TOUCH_PERSISTS)) {
          // console.log('stay contact', shapeA, shapeB);
          isTriggerPair
            ? eventCallbacks?.onTriggerStay?.(shapeA, shapeB)
            : eventCallbacks?.onContactStay?.(shapeA, shapeB);
        }
      }
    };

    // not used because we use onContact to simulate trigger events
    simulationEventCallbackImpl.onTrigger = (pairsPointer, count) => {
      const pairs = pairsPointer;
      const px = this._px;
      for (let i = 0; i < count; i++) {
        const pair = px.NativeArrayHelpers.prototype.getTriggerPairAt(pairs, i);
        if (
          pair.flags.isSet(px.PxTriggerPairFlagEnum.eREMOVED_SHAPE_OTHER) ||
          pair.flags.isSet(px.PxTriggerPairFlagEnum.eREMOVED_SHAPE_TRIGGER)
        )
          continue;
        const isEnter = pair.status === px.PxPairFlagEnum.eNOTIFY_TOUCH_FOUND;

        const trigger = this._pxColliderMap[(pair.triggerShape as any).ptr]?._id;
        const other = this._pxColliderMap[(pair.otherShape as any).ptr]?._id;

        if (!trigger || !other) {
          console.error('trigger or other actor is null');
          return;
        }

        if (isEnter) {
          console.log('begin trigger', trigger, other);
          const event =
            trigger < other
              ? this._registerTriggerRelation(trigger, other)
              : this._registerTriggerRelation(other, trigger);
          event.triggerState = TriggerState.Enter;
          this._currentEvents.add(event);
        } else {
          console.log('end trigger', trigger, other);
          const event =
            trigger < other
              ? this._unRegisterTriggerRelation(trigger, other)
              : this._unRegisterTriggerRelation(other, trigger);
          // this event has been pushed into this._currentEvents
          event.triggerState = TriggerState.Exit;
        }
      }
    };

    // sceneDesc.simulationEventCallback = simulationEventCallbackImpl;
    const scene = nativePxPhysics.createScene(sceneDesc);
    scene.setSimulationEventCallback(simulationEventCallbackImpl);
    this._pxScene = scene;
    this._pxControllerManager = px.CreateControllerManager(scene);
  }

  destroy() {
    this._pxScene.release();
    this._pxScene = null!;
  }

  private _simulate(deltaTime: number) {
    this._pxScene.simulate(deltaTime);
  }

  /**
   * Check to see if the simulation run has completed and fire appropriate callbacks if fetched.
   * @param block When set to true will block until the condition is met.
   */
  private _fetchResult(block = true) {
    this._pxScene.fetchResults(block);
  }

  private _fireEvents() {
    const { _currentEvents: currentEvents } = this;
    currentEvents.forEach((currentEvent) => {
      switch (currentEvent.triggerState) {
        case TriggerState.Enter:
          this._onTriggerBegin?.(currentEvent._obj1, currentEvent._obj2);
          currentEvent.triggerState = TriggerState.Stay;
          break;
        case TriggerState.Stay:
          this._onTriggerStay?.(currentEvent._obj1, currentEvent._obj2);
          break;
        case TriggerState.Exit:
          this._onTriggerEnd?.(currentEvent._obj1, currentEvent._obj2);
          currentEvents.delete(currentEvent);
          this._triggerEventPool.recycle(currentEvent);
          break;
        case TriggerState.None:
          throw new Error(`trigger state is none between ${currentEvent._obj1}-${currentEvent._obj2}`);
      }
    });
  }

  private _registerTriggerRelation(id1: number, id2: number) {
    const event = this._triggerEventPool.require();
    event._obj1 = id1;
    event._obj2 = id2;
    this._triggerEventTable[id1][id2] = event;
    return event;
  }

  private _unRegisterTriggerRelation(id1: number, id2: number) {
    const event = this._triggerEventTable[id1][id2];
    delete this._triggerEventTable[id1][id2];
    return event;
  }

  /** registered into scene's colliderMap if any collider is attached to scene */
  _onColliderAdd(collider: PxPhysicsCollider) {
    this._pxColliderMap[(collider._pxShape as any).ptr] = collider;
    this._triggerEventTable[collider._id] = {};
  }

  /** registered into scene's colliderMap if any collider is removed from scene */
  _onColliderRemove(collider: PxPhysicsCollider) {
    const {
      _currentEvents: currentEvents,
      _triggerEventTable: triggerEventTable,
      _triggerEventPool: triggerEventPool,
    } = this;

    delete this._pxColliderMap[(collider._pxShape as any).ptr];

    currentEvents.forEach((event, i) => {
      if (event._obj1 === collider._id) {
        currentEvents.deleteByIndex(i);
        triggerEventPool.recycle(event);
      } else if (event._obj2 === collider._id) {
        delete triggerEventTable[event._obj1][event._obj2];
        currentEvents.deleteByIndex(i);
        triggerEventPool.recycle(event);
      }
    });
    delete triggerEventTable[collider._id];
  }

  _onControllerAdd(controller: PxPhysicsCharacterController) {
    this._pxControllerMap[(controller._pxController as any).ptr] = controller;
  }

  _onControllerRemove(controller: PxPhysicsCharacterController) {
    delete this._pxControllerMap[(controller._pxController as any).ptr];
  }

  update(deltaTime: number) {
    this._simulate(deltaTime);
    this._fetchResult();
    this._fireEvents();
  }

  addRigidbody(rb: PxPhysicsRigidBody) {
    this._pxScene.addActor(rb._pxRigidBody);
    rb._scene = this;
    rb.activeInScene = true;
  }

  removeRigidbody(rb: PxPhysicsRigidBody) {
    this._pxScene.removeActor(rb._pxRigidBody);
    rb.activeInScene = false;
    rb._scene = null;
  }

  addCharacterController(controller: PxPhysicsCharacterController) {
    // TODO
    controller.activeInScene = true;
  }

  removeCharacterController(controller: PxPhysicsCharacterController) {
    // TODO
    controller.activeInScene = false;
  }

  createCharacterController(id: number): ICharacterController {
    const controller = new PxPhysicsCharacterController(this, id);
    return controller;
  }

  setGravity(gravity: Vector3) {
    this._pxScene.setGravity(new this._px.PxVec3(gravity.x, gravity.y, gravity.z));
  }

  private _tempPosition: Vector3 = new Vector3();
  private _tempNormal: Vector3 = new Vector3();
  raycast(
    origin: IVector3,
    direction: IVector3,
    maxDistance: number,
    onHit?: (id: number, distance: number, position: Vector3, normal: Vector3) => void
  ): boolean {
    const { _raycastBuffer: raycastBuffer, _raycastFlags: rayCastFlags } = this;

    const isHit = this._pxScene.raycast(
      toPxVec3(origin, this._tempVec1),
      toPxVec3(direction, this._tempVec2),
      maxDistance,
      raycastBuffer,
      rayCastFlags
    );

    if (onHit) {
      const hit = raycastBuffer.block;
      const distance = hit.distance;
      IVector3.copy(this._tempNormal, hit.normal);
      IVector3.copy(this._tempPosition, hit.position);
      const id = this._pxColliderMap[(hit.shape as any).ptr]?._id || null;
      if (!id) {
        throw new Error('collider not found');
      }
      onHit(id, distance, this._tempPosition, this._tempNormal);
    }

    return isHit;
  }
}
