import PhysX from 'physx-js-webidl';
import { PxPhysicsScene } from './PxPhysicsScene';
import { PxPhysicsStaticRigidBody } from './PxPhysicsStaticRigidBody';
import { Quaternion, Vector3 } from 'three';
import { PxPhysicsDynamicRigidBody } from './PxPhysicsDynamicRigidBody';
import { PxCombineMode } from './enum';
import { PxPhysicsMaterial } from './PxPhysicsMaterial';
import { PxPhysicsBoxCollider, PxPhysicsSphereCollider } from './collider';

declare global {
  interface Window {
    PhysX: typeof PhysX & typeof PhysX.PxTopLevelFunctions;
  }
}

/** wrapper of PhysX.PxPhysics */
export class PxPhysics {
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

    const physX = await PhysX();
    this._physX = physX;
    window.PhysX = physX;
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

  createScene(
    onContactBegin?: (obj1: number, obj2: number) => void,
    onContactEnd?: (obj1: number, obj2: number) => void,
    onContactStay?: (obj1: number, obj2: number) => void,
    onTriggerBegin?: (obj1: number, obj2: number) => void,
    onTriggerEnd?: (obj1: number, obj2: number) => void,
    onTriggerStay?: (obj1: number, obj2: number) => void
  ) {
    const scene = new PxPhysicsScene(this);
    return scene;
  }

  createStaticRigidBody(position: Vector3, rotation: Quaternion) {
    const rb = new PxPhysicsStaticRigidBody(this, position, rotation);
    return rb;
  }

  createDynamicRigidBody(position: Vector3, rotation: Quaternion) {
    const rb = new PxPhysicsDynamicRigidBody(this, position, rotation);
    return rb;
  }

  createPhysicMaterial(
    staticFriction: number,
    dynamicFriction: number,
    restitution: number,
    frictionCombineMode: PxCombineMode,
    restitutionCombineMode: PxCombineMode
  ) {
    return new PxPhysicsMaterial(
      this,
      staticFriction,
      dynamicFriction,
      restitution,
      frictionCombineMode,
      restitutionCombineMode
    );
  }

  createBoxCollider(size: Vector3, material: PxPhysicsMaterial) {
    return new PxPhysicsBoxCollider(this, size, material);
  }

  createSphereCollider(radius: number, material: PxPhysicsMaterial) {
    return new PxPhysicsSphereCollider(this, radius, material);
  }
}
