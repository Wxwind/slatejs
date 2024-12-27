import PhysX from 'physx-js-webidl';
import { IVector3 } from '@/type';
import { PhysicsControllerNonWalkableModeEnum, PhysicsCombineMode } from './enum';
import { Quaternion } from 'three';

export type PhysicsEventCallbacks = {
  onContactBegin?: (obj1: number, obj2: number) => void;
  onContactEnd?: (obj1: number, obj2: number) => void;
  onContactStay?: (obj1: number, obj2: number) => void;
  onTriggerBegin?: (obj1: number, obj2: number) => void;
  onTriggerEnd?: (obj1: number, obj2: number) => void;
  onTriggerStay?: (obj1: number, obj2: number) => void;
};

export interface IPhysics {
  initialize(): Promise<void>;
  createScene(gravity: IVector3, eventCallbacks?: PhysicsEventCallbacks): IPhysicsScene;
  createStaticRigidBody(position: IVector3, rotation: Quaternion): IStaticRigidBody;
  createDynamicRigidBody(position: IVector3, rotation: Quaternion): IDynamicRigidbody;
  createPhysicMaterial(
    staticFriction: number,
    dynamicFriction: number,
    restitution: number,
    frictionCombineMode: PhysicsCombineMode,
    restitutionCombineMode: PhysicsCombineMode
  ): IPhysicsMaterial;
  createBoxCollider(id: number, size: IVector3, material: IPhysicsMaterial): IBoxCollider;
  createSphereCollider(id: number, radius: number, material: IPhysicsMaterial): ISphereCollider;
  createCapsuleCollider(id: number, radius: number, height: number, material: IPhysicsMaterial): ICapsuleCollider;
  createPlaneCollider(id: number, material: IPhysicsMaterial): IPlaneCollider;
}

export interface IRigidbody {
  /**
   * Add collider on rigidbody.
   * @param collider - The collider shape attached
   */
  addCollider(collider: ICollider): void;

  /**
   * Remove collider on rigidbody.
   */
  removeCollider(shape: ICollider): void;

  /**
   * get world transform from native rigidbody
   */
  getWorldTransform(outPosition: IVector3, outRotation: Quaternion): void;

  /**
   * set world transform to native rigidbody
   */
  setWorldTransform(position: IVector3, rotation: Quaternion): void;

  /**
   * Deletes the rigidbody.
   */
  destroy(): void;
}

export interface IStaticRigidBody extends IRigidbody {}

/**
 * Interface of physics dynamic rigidbody.
 */
export interface IDynamicRigidbody extends IRigidbody {
  /**
   * Set global transform of rigidbody.
   * @param position - The global position
   * @param rotation - The global rotation
   */
  setWorldTransform(position: IVector3, rotation: Quaternion): void;
  /**
   * Get global transform of position.
   * @param outPosition - The global position
   * @param outRotation - The global rotation
   */
  getWorldTransform(outPosition: IVector3, outRotation: Quaternion): void;
  /**
   * Sets the linear damping coefficient.
   * @param value - Linear damping coefficient.
   */
  setLinearDamping(value: number): void;
  /**
   * Sets the angular damping coefficient.
   * @param value - Angular damping coefficient.
   */
  setAngularDamping(value: number): void;
  /**
   * Sets the linear velocity of the actor.
   * @param value - New linear velocity of actor.
   */
  setLinearVelocity(value: IVector3): void;
  /**
   * Sets the angular velocity of the actor.
   * @param value - New angular velocity of actor.
   */
  setAngularVelocity(value: IVector3): void;
  /**
   *  Sets the mass of a dynamic actor.
   * @param value - New mass value for the actor.
   */
  setMass(value: number): void;
  /**
   * Sets the pose of the center of mass relative to the actor.
   * @param position - Mass frame offset position relative to the actor frame.
   * @param rotation - Mass frame offset rotation relative to the actor frame.
   */
  setCenterOfMass(position: IVector3, rotation: Quaternion): void;
  /**
   * Sets the inertia tensor, using a parameter specified in mass space coordinates.
   * @param value - New mass space inertia tensor for the actor.
   */
  setInertiaTensor(value: IVector3): void;
  /**
   * Set the maximum angular velocity permitted for this actor.
   * @param value - Max allowable angular velocity for actor.
   */
  setMaxAngularVelocity(value: number): void;
  /**
   * Sets the maximum depenetration velocity permitted to be introduced by the solver (velocity that the solver can set to a body while trying to pull it out of overlap with the other bodies).
   * @param value - The maximum velocity to de-penetrate (0, PX_MAX_F32]
   */
  setMaxDepenetrationVelocity(value: number): void;
  /**
   * Sets the mass-normalized kinetic energy threshold below which an actor may go to sleep.
   * @param value - Energy below which an actor may go to sleep.
   */
  setSleepThreshold(value: number): void;
  /**
   * Sets the solver iteration counts for the body.
   * @param value - Number of position iterations the solver should perform for this body.
   */
  setSolverIterations(value: number): void;
  /**
   * Sets the colliders' collision detection mode.
   * @param value - rigid body flag
   */
  setCollisionDetectionMode(value: number): void;
  /**
   * Controls whether physics affects the dynamic collider.
   * @param value - is or not
   */
  setIsKinematic(value: boolean): void;
  /**
   * Raises or clears a particular rigid dynamic lock flag.
   * @param flags - the flag to raise(set) or clear.
   */
  setConstraints(flags: number): void;
  /**
   * Apply a force to the dynamic collider.
   * @param force - The force make the collider move
   */
  addForce(force: IVector3): void;
  /**
   * Apply a torque to the dynamic collider.
   * @param torque - The force make the collider rotate
   */
  addTorque(torque: IVector3): void;
  /**
   * Moves kinematically controlled dynamic actors through the game world.
   * @param positionOrRotation - The desired position or rotation for the kinematic actor
   * @param rotation - The desired rotation for the kinematic actor
   */
  move(positionOrRotation: IVector3 | Quaternion, rotation?: Quaternion): void;
  /**
   * Forces a collider to sleep at least one frame.
   */
  sleep(): void;
  /**
   * Forces a collider to wake up.
   */
  wakeUp(): void;
}

export interface ICollider {
  /**
   * Set local rotation.
   * @param rotation - The local rotation
   */
  setRotation(rotation: Quaternion): void;
  /**
   * Set local position.
   * @param position - The local position
   */
  setPosition(position: IVector3): void;
  /**
   * Set world scale.
   * @param scale - The world scale
   */
  setWorldScale(scale: IVector3): void;

  /**
   * Sets the contact offset.
   * @param offset - contact offset
   */
  setContactOffset(offset: number): void;
  /**
   * Set physics material on shape.
   * @param material - The physics material
   */
  //  setMaterial(material: IPhysicsMaterial): void;
  /**
   * Set trigger or not.
   * @param value - True for TriggerShape, false for SimulationShape
   */
  setIsTrigger(value: boolean): void;
  /**
   * Decrements the reference count of a shape and releases it if the new reference count is zero.
   */
  destroy(): void;
}

export interface IPhysicsMaterial {
  /**
   * Set the coefficient of restitution.
   * @param value - The bounciness
   */
  setRestitution(value: number): void;
  /**
   * Set the coefficient of dynamic friction.
   * @param value - The dynamic friction
   */
  setDynamicFriction(value: number): void;
  /**
   * Set the coefficient of static friction.
   * @param value - The static friction
   */
  setStaticFriction(value: number): void;
  /**
   * Set the restitution combine mode.
   * @param value - The combine mode
   */
  setRestitutionCombineMode(value: PhysicsCombineMode): void;
  /**
   * Set the friction combine mode.
   * @param value - The combine mode
   */
  setFrictionCombineMode(value: PhysicsCombineMode): void;
  /**
   * Decrements the reference count of a material and releases it if the new reference count is zero.
   */
  destroy(): void;
}

/**
 * Base class for character controllers.
 */
export interface ICharacterController extends IRigidbody {
  /**
   * set radius of characterController's capsuleCollider.
   * @param radius the capsuleCollider's radius
   */
  setRadius(radius: number): void;
  /**
   * set height of characterController's capsuleCollider.
   * @param height the capsuleCollider's height
   */
  setHeight(height: number): void;
  /**
   * Moves the character using a "collide-and-slide" algorithm.
   * @param disp the displacement vector for current frame. It is typically a combination of vertical motion due to gravity and lateral motion when your character is moving. Note that users are responsible for applying gravity to characters here.
   * @param minDist minimal length used to stop the recursive displacement algorithm early when remaining distance to travel goes below this limit.
   * @param elapsedTime the amount of time that passed since the last call to the move function
   * @param filters filtering parameters similar to the ones used in the SDK. Use these to control what the character should collide with.
   * @param obstacles obstacle objects with which the character should collide. Those objects are fully controlled by users and do not need to have counterpart SDK objects. Note that touched obstacles are cached, meaning that the cache needs to be invalidated if the collection of obstacles changes
   */
  move(
    disp: IVector3,
    minDist: number,
    elapsedTime: number,
    filters?: PhysX.PxControllerFilters,
    obstacles?: PhysX.PxObstacleContext | undefined
  ): number;
  /**
   * Sets controller's world position.
   * @param position The new (center) position for the controller.
   */
  setWorldPosition(position: IVector3): void;
  /**
   * Retrieve the world position of the controller.
   * @param position The controller's center position
   */
  getWorldPosition(outPosition: IVector3): void;
  /**
   * Retrieve the world foot position of the controller/
   * @param outPosition The controller's foot position. the foot position takes the contact offset into account
   */
  getFootPosition(outPosition: IVector3): void;
  /**
   * The step height.
   * @param offset The new step offset for the controller.
   */
  setStepOffset(offset: number): void;
  /**
   * Sets the non-walkable mode for the CCT.
   * @param flag The new value of the non-walkable mode.
   */
  setNonWalkableMode(flag: PhysicsControllerNonWalkableModeEnum): void;
  /**
   * Sets the 'up' direction.
   * @param up The up direction for the controller.
   */
  setUpDirection(up: IVector3): void;
  /**
   * Sets the slope limit (cosine of desired limit angle).
   * @param slopeLimit The slope limit for the controller.
   */
  setSlopeLimit(slopeLimit: number): void;
}

/**
 * Interface for physics manager.
 */
export interface IPhysicsScene {
  /**
   * Set gravity.
   * @param gravity - Physics gravity
   */
  setGravity(gravity: IVector3): void;
  /**
   * Add ICollider into the manager.
   * @param rigidbody - StaticRigidbody or DynamicRigidbody.
   */
  addRigidbody(rigidbody: IRigidbody): void;
  /**
   * Remove ICollider.
   * @param rigidbody - StaticRigidbody or DynamicRigidbody.
   */
  removeRigidbody(rigidbody: IRigidbody): void;
  /**
   * Create ICharacterController.
   */
  createCharacterController(): ICharacterController;
  /**
   * Call on every frame to update pose of objects.
   * @param elapsedTime - Step time of update.
   */
  update(elapsedTime: number): void;
  /**
   * Release native physics scene
   */
  destroy(): void;
}

export interface IBoxCollider extends ICollider {
  setSize(size: IVector3): void;
}

export interface ISphereCollider extends ICollider {
  setRadius(radius: number): void;
}

export interface ICapsuleCollider extends ICollider {
  setRadius(radius: number): void;
  setHeight(height: number): void;
}

export interface IPlaneCollider extends ICollider {}
