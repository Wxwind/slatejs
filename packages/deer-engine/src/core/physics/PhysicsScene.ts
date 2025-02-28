import { DeerScene } from '../DeerScene';
import { RigidbodyComponent } from './RigidbodyComponent';
import { ComponentManager } from '../manager';
import { DisorderedArray } from '../DisorderedMap';
import { Vector, Vector3 } from 'three';
import {
  InternalControllerColliderHit,
  IPhysics,
  IPhysicsScene,
  PhysicsEventCallbacks,
  ControllerColliderHit,
} from './interface';
import { CharacterControllerComponent } from './CharacterControllerComponent';
import { Script } from '../component';
import { Collider } from './collider';
import { IVector3 } from '@/type';
import { HitResult } from './HitResult';
import { isDynamicRigidBody } from './utils';

export class PhysicsScene {
  private _accumulator: number = 0;
  private _fixedDeltaTime = 1 / 60;
  private _currentFrame = 0;
  private _totalElapsedTime = 0;

  private _currentFPS = 0;
  private _accumulatedElapsedTimeInSecond = 0;
  private _accumulatedFrameCountPerSecond = 0;

  private _scene: DeerScene;

  static _nativePhysics: IPhysics;
  _nativePhysicsScene: IPhysicsScene;

  private _rigidbodies = new DisorderedArray<RigidbodyComponent>();
  private _controllerMap: Record<number, CharacterControllerComponent> = {};

  private _gravity: Vector3 = new Vector3(0, -9.81, 0);

  private _nativeShapeMap: Record<number, Collider> = {};

  get gravity() {
    return this._gravity;
  }

  set gravity(v: Vector3) {
    this._gravity = v;
    this._nativePhysicsScene.setGravity(v);
  }

  get fixedDeltaTime() {
    return this._fixedDeltaTime;
  }

  get currentFrame() {
    return this._currentFrame;
  }

  get currentFPS() {
    return this._currentFPS;
  }

  constructor(attachedScene: DeerScene) {
    this._scene = attachedScene;
    const eventCallbacks: PhysicsEventCallbacks = {
      onContactBegin: this._onContactBegin,
      onContactEnd: this._onContactEnd,
      onContactStay: this._onContactStay,
      onTriggerBegin: this._onTriggerBegin,
      onTriggerEnd: this._onTriggerEnd,
      onTriggerStay: this._onTriggerStay,
      onControllerHit: this._controllerColliderHit,
    };
    this._nativePhysicsScene = PhysicsScene._nativePhysics.createScene(this.gravity, eventCallbacks);
  }

  destroy() {
    this._nativePhysicsScene.destroy();
  }

  update(deltaTime: number) {
    this._totalElapsedTime += deltaTime;
    this._accumulatedElapsedTimeInSecond += deltaTime;
    this._accumulator += deltaTime;
    const compMgr = this._scene.getManager(ComponentManager)!;

    const count = Math.floor(this._accumulator / this._fixedDeltaTime);
    for (let i = 0; i < count; i++) {
      compMgr.callScriptOnFixedUpdate();
      this._callColliderOnUpdate();
      this._nativePhysicsScene.update(this._fixedDeltaTime);
      this._callColliderOnLateUpdate();
      this._accumulator -= this._fixedDeltaTime;

      if (this._accumulatedElapsedTimeInSecond > 1.0 && this._accumulatedFrameCountPerSecond > 0) {
        this._currentFPS = this._accumulatedFrameCountPerSecond / this._accumulatedElapsedTimeInSecond;
        this._accumulatedElapsedTimeInSecond = 0;
        this._accumulatedFrameCountPerSecond = 0;
      }

      this._currentFrame++;
      this._accumulatedFrameCountPerSecond++;
    }
  }

  _onColliderAdd(collider: Collider) {
    this._nativeShapeMap[collider._id] = collider;
  }

  _onColliderRemove(collider: Collider) {
    delete this._nativeShapeMap[collider._id];
  }

  ////// PhysicsEventCallbacks //////

  _onContactBegin = (obj1: number, obj2: number) => {
    const coll1 = this._nativeShapeMap[obj1];
    const coll2 = this._nativeShapeMap[obj2];
    if (!coll1 || !coll2) {
      console.error(`native collider ${coll1}(${obj1}) or ${coll2}${obj2} lost binding`);
      return;
    }

    if (!(isDynamicRigidBody(coll1.rigidbody) || isDynamicRigidBody(coll1.rigidbody))) {
      return;
    }

    coll1.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onCollisionEnter(coll2);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );

    coll2.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onCollisionEnter(coll1);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );
  };

  _onContactStay = (obj1: number, obj2: number) => {
    const coll1 = this._nativeShapeMap[obj1];
    const coll2 = this._nativeShapeMap[obj2];
    if (!coll1 || !coll2) {
      console.error(`native collider ${coll1}(${obj1}) or ${coll2}${obj2} lost binding`);
      return;
    }

    if (!(isDynamicRigidBody(coll1.rigidbody) || isDynamicRigidBody(coll1.rigidbody))) {
      return;
    }

    coll1.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onCollisionStay(coll2);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );

    coll2.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onCollisionStay(coll1);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );
  };

  _onContactEnd = (obj1: number, obj2: number) => {
    const coll1 = this._nativeShapeMap[obj1];
    const coll2 = this._nativeShapeMap[obj2];
    if (!coll1 || !coll2) {
      console.error(`native collider ${coll1}(${obj1}) or ${coll2}${obj2} lost binding`);
      return;
    }

    if (!(isDynamicRigidBody(coll1.rigidbody) || isDynamicRigidBody(coll1.rigidbody))) {
      return;
    }

    coll1.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onCollisionExit(coll2);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );

    coll2.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onCollisionExit(coll1);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );
  };

  _onTriggerBegin = (obj1: number, obj2: number) => {
    const coll1 = this._nativeShapeMap[obj1];
    const coll2 = this._nativeShapeMap[obj2];
    if (!coll1 || !coll2) {
      console.error(`native collider ${coll1}(${obj1}) or ${coll2}${obj2} lost binding`);
      return;
    }

    coll1.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onTriggerEnter(coll2);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );

    coll2.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onTriggerEnter(coll1);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );
  };

  _onTriggerStay = (obj1: number, obj2: number) => {
    const coll1 = this._nativeShapeMap[obj1];
    const coll2 = this._nativeShapeMap[obj2];
    if (!coll1 || !coll2) {
      console.error(`native collider ${coll1}(${obj1}) or ${coll2}${obj2} lost binding`);
      return;
    }

    coll1.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onTriggerStay(coll2);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );

    coll2.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onTriggerStay(coll1);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );
  };

  _onTriggerEnd = (obj1: number, obj2: number) => {
    const coll1 = this._nativeShapeMap[obj1];
    const coll2 = this._nativeShapeMap[obj2];
    if (!coll1 || !coll2) {
      console.error(`native collider ${coll1}(${obj1}) or ${coll2}${obj2} lost binding`);
      return;
    }

    coll1.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onTriggerExit(coll2);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );

    coll2.rigidbody.entity._scripts.forEach(
      (script) => {
        script.onTriggerExit(coll1);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );
  };

  _controllerColliderHit = (controllerId: number, hit: InternalControllerColliderHit) => {
    const controller = this._controllerMap[controllerId];
    if (!controller) {
      console.error(`native controller ${controllerId} lost binding`);
      return;
    }

    const collider = this._nativeShapeMap[hit.colliderId];

    const hitInfo: ControllerColliderHit = {
      collider,
      controller,
      normal: hit.normal,
      point: hit.point,
      moveDirection: hit.direction,
      moveLength: hit.length,
    };

    controller.entity._scripts.forEach(
      (script) => {
        script.onControllerColliderHit(hitInfo);
      },
      (element: Script, index: number) => {
        element._entityScriptsIndex = index;
      }
    );
  };

  ///////////////////////////////////

  _callColliderOnUpdate() {
    const rbs = Array.from(this._rigidbodies._elements);
    for (let i = 0; i < this._rigidbodies.length; i++) {
      const comp = rbs[i];
      comp._onColliderUpdate();
    }
  }

  _callColliderOnLateUpdate() {
    const rbs = Array.from(this._rigidbodies._elements);
    for (let i = 0; i < this._rigidbodies.length; i++) {
      const comp = rbs[i];
      comp._onColliderLateUpdate();
    }
  }

  _addRigidbody(rb: RigidbodyComponent) {
    if (rb._index === -1) {
      rb._index = this._rigidbodies.length;
      this._rigidbodies.add(rb);
    }

    this._nativePhysicsScene.addRigidbody(rb._nativeRigidbody);
    for (const collider of rb._colliders) {
      this._onColliderAdd(collider);
    }
  }

  _addCharacterController(cct: CharacterControllerComponent) {
    if (cct._index === -1) {
      cct._index = this._rigidbodies.length;
      this._rigidbodies.add(cct);
      this._controllerMap[cct._id] = cct;
    }

    this._nativePhysicsScene.addCharacterController(cct._nativeRigidbody);
  }

  _removeRigidbody(rb: RigidbodyComponent) {
    const replaced = this._rigidbodies.deleteByIndex(rb._index);
    replaced && (replaced._index = rb._index);
    rb._index = -1;

    this._nativePhysicsScene.removeRigidbody(rb._nativeRigidbody);
    for (const collider of rb._colliders) {
      this._onColliderRemove(collider);
    }
  }

  _removeCharacterController(cct: CharacterControllerComponent) {
    const replaced = this._rigidbodies.deleteByIndex(cct._index);
    replaced && (replaced._index = cct._index);
    cct._index = -1;
    delete this._controllerMap[cct._id];

    this._nativePhysicsScene.removeCharacterController(cct._nativeRigidbody);
  }

  raycast(origin: IVector3, direction: IVector3, distance: number, outHitResult?: HitResult): boolean {
    if (outHitResult) {
      const onHit = (id: number, distance: number, position: Vector3, normal: Vector3) => {
        const hitCollider = this._nativeShapeMap[id] || null;
        outHitResult.distance = distance;
        outHitResult.point = position;
        outHitResult.normal = normal;
        outHitResult.collider = hitCollider;
        outHitResult.entity = hitCollider?._rigidbody?.entity || null;
      };

      return this._nativePhysicsScene.raycast(origin, direction, distance, onHit);
    }

    return this._nativePhysicsScene.raycast(origin, direction, distance);
  }
}
