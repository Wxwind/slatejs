import PhysX from 'physx-js-webidl';
import { PxPhysicsScene } from './PxPhysicsScene';
import { PxPhysicsStaticRigidBody } from './PxPhysicsStaticRigidBody';
import { Quaternion, Vector3 } from 'three';
import { PxPhysicsDynamicRigidBody } from './PxPhysicsDynamicRigidBody';
import { PhysicsCombineMode } from '../../core/physics/enum';
import { PxPhysicsMaterial } from './PxPhysicsMaterial';
import {
  PxPhysicsBoxCollider,
  PxPhysicsCapsuleCollider,
  PxPhysicsPlaneCollider,
  PxPhysicsSphereCollider,
} from './collider';
import { IVector3 } from '@/type';
import {
  IBoxCollider,
  ICapsuleCollider,
  IDynamicRigidbody,
  IPhysics,
  IPhysicsMaterial,
  IPhysicsScene,
  IPlaneCollider,
  ISphereCollider,
  IStaticRigidBody,
  PhysicsEventCallbacks,
} from '@/core/physics/interface';

/** wrapper of PhysX.PxPhysics */
export class PxPhysics implements IPhysics {
  private _isInitialized = false;

  _pxPhysics!: PhysX.PxPhysics;
  _physX!: typeof PhysX & typeof PhysX.PxTopLevelFunctions;

  async initialize(): Promise<void> {
    if (this._isInitialized) return;

    // const scriptPromise = new Promise((resolve, reject) => {
    //   const script = document.createElement('script');
    //   document.body.appendChild(script);
    //   script.async = true;
    //   script.onload = resolve;
    //   script.onerror = reject;
    //   script.src =
    //     'https://rawcdn.githack.com/fabmax/physx-js-webidl/486557a9a90580b502def20e8868cd968b6163b4/dist/physx-js-webidl.js';
    // });

    //  await scriptPromise;
    // await PhysX({ locateFile: () => wasmUrl })
    const physX = await PhysX({});
    this._physX = physX;
    this._initialize(physX);
    this._isInitialized = true;
  }

  private _initialize(Px: typeof PhysX & typeof PhysX.PxTopLevelFunctions) {
    const version = Px.PHYSICS_VERSION;
    console.log(
      'PhysX loaded! Version: ' +
        ((version >> 24) & 0xff) +
        '.' +
        ((version >> 16) & 0xff) +
        '.' +
        ((version >> 8) & 0xff)
    );
    const allocator = new Px.PxDefaultAllocator();
    const errorCb = new Px.PxDefaultErrorCallback();

    const foundation = Px.CreateFoundation(version, allocator, errorCb);

    const physics = Px.CreatePhysics(version, foundation, new Px.PxTolerancesScale());

    this._pxPhysics = physics;
  }

  createScene(gravity: IVector3, eventCallbacks?: PhysicsEventCallbacks): IPhysicsScene {
    const scene = new PxPhysicsScene(this, gravity, eventCallbacks);
    return scene;
  }

  createStaticRigidBody(position: IVector3, rotation: Quaternion): IStaticRigidBody {
    const rb = new PxPhysicsStaticRigidBody(this._physX, this._pxPhysics, position, rotation);
    return rb;
  }

  createDynamicRigidBody(position: IVector3, rotation: Quaternion): IDynamicRigidbody {
    const rb = new PxPhysicsDynamicRigidBody(this._physX, this._pxPhysics, position, rotation);
    return rb;
  }

  createPhysicMaterial(
    staticFriction: number,
    dynamicFriction: number,
    restitution: number,
    frictionCombineMode: PhysicsCombineMode,
    restitutionCombineMode: PhysicsCombineMode
  ): IPhysicsMaterial {
    return new PxPhysicsMaterial(
      this,
      staticFriction,
      dynamicFriction,
      restitution,
      frictionCombineMode,
      restitutionCombineMode
    );
  }

  createBoxCollider(id: number, size: Vector3, material: PxPhysicsMaterial): IBoxCollider {
    return new PxPhysicsBoxCollider(this, id, size, material);
  }

  createSphereCollider(id: number, radius: number, material: PxPhysicsMaterial): ISphereCollider {
    return new PxPhysicsSphereCollider(this, id, radius, material);
  }

  createCapsuleCollider(id: number, radius: number, height: number, material: PxPhysicsMaterial): ICapsuleCollider {
    return new PxPhysicsCapsuleCollider(this, id, radius, height, material);
  }

  createPlaneCollider(id: number, material: PxPhysicsMaterial): IPlaneCollider {
    return new PxPhysicsPlaneCollider(this, id, material);
  }

  destroy() {
    this._pxPhysics.release();
    this._pxPhysics = null!;
  }
}
