import { IVector3 } from '@/type';
import { PhysicsScene } from './PhysicsScene';
import { Entity } from '../entity';
import { RigidbodyComponent } from './RigidbodyComponent';
import { Vector3, Quaternion } from 'three';
import { objectToLocalPosition, objectToLocalQuaternion } from '@/util';
import { IDynamicRigidbody } from './interface';
import { CollisionDetectionMode, DynamicRigidbodyConstraints } from './enum';

export class DynamicRigidbodyComponent extends RigidbodyComponent {
  type = 'DynamicRigidbodyComponent' as const;

  _nativeRigidbody: IDynamicRigidbody;

  constructor(entity: Entity) {
    super(entity);

    this._nativeRigidbody = PhysicsScene._nativePhysics.createDynamicRigidBody(
      this.sceneObject.getWorldPosition(new Vector3()),
      this.sceneObject.getWorldQuaternion(new Quaternion())
    );
  }

  _tempPosition = new Vector3();
  _tempRotation = new Quaternion();

  private _mass: number = 1.0;
  public get mass(): number {
    return this._mass;
  }
  public set mass(v: number) {
    this._nativeRigidbody.setMass(v);
    this._mass = v;
  }

  private _linearDamping: number = 0.0;
  public get linearDamping(): number {
    return this._linearDamping;
  }
  public set linearDamping(v: number) {
    this._linearDamping = v;
    this._nativeRigidbody.setLinearDamping(v);
  }

  private _angularDamping: number = 0.05;
  public get angularDamping(): number {
    return this._angularDamping;
  }
  public set angularDamping(v: number) {
    this._angularDamping = v;
    this._nativeRigidbody.setAngularDamping(v);
  }

  private _linearVelocity: Vector3 = new Vector3(0, 0, 0);
  public get linearVelocity(): Vector3 {
    return this._linearVelocity;
  }
  public set linearVelocity(v: Vector3) {
    this._linearVelocity = v;
    this._nativeRigidbody.setLinearVelocity(v);
  }

  private _angularVelocity: Vector3 = new Vector3(0, 0, 0);
  public get angularVelocity(): Vector3 {
    return this._angularVelocity;
  }
  public set angularVelocity(v: Vector3) {
    this._angularVelocity = v;
    this._nativeRigidbody.setAngularVelocity(v);
  }

  private _centerOfMassPosition = new Vector3();
  public get centerOfMassPosition(): Vector3 {
    return this._centerOfMassPosition;
  }
  public set centerOfMassPosition(v: Vector3) {
    this._centerOfMassPosition = v;
    this._nativeRigidbody.setCenterOfMass(v, this._centerOfMassRotation);
  }

  private _centerOfMassRotation = new Quaternion();
  public get centerOfMassRotation(): Quaternion {
    return this._centerOfMassRotation;
  }
  public set centerOfMassRotation(v: Quaternion) {
    this.centerOfMassRotation = v;
    this._nativeRigidbody.setCenterOfMass(this._centerOfMassPosition, v);
  }

  private _inertiaTensor: Vector3 = new Vector3(1, 1, 1);
  public get inertiaTensor(): Vector3 {
    return this._inertiaTensor;
  }
  public set inertiaTensor(v: Vector3) {
    this._inertiaTensor = v;
    this._nativeRigidbody.setInertiaTensor(v);
  }

  // Default: 50.0 rad/s for PxArticulationLink, 100.0 rad/s for PxRigidDynamic
  private _maxAngularVelocity: number = 100.0;
  public get maxAngularVelocity(): number {
    return this._maxAngularVelocity;
  }
  public set maxAngularVelocity(v: number) {
    this._maxAngularVelocity = v;
    this._nativeRigidbody.setMaxAngularVelocity(v);
  }

  private _maxDepenetrationVelocity: number = 1e32;
  public get maxDepenetrationVelocity(): number {
    return this._maxDepenetrationVelocity;
  }
  public set maxDepenetrationVelocity(v: number) {
    this._maxDepenetrationVelocity = v;
    this._nativeRigidbody.setMaxDepenetrationVelocity(v);
  }

  // Default: 5e-5f * PxTolerancesScale::speed * PxTolerancesScale::speed
  private _sleepThreshold: number = 0;
  public get sleepThreshold(): number {
    return this._sleepThreshold;
  }
  public set sleepThreshold(v: number) {
    this._sleepThreshold = v;
    this._nativeRigidbody.setSleepThreshold(v);
  }

  private _solverIterations: number = 4;
  public get solverIterations(): number {
    return this._solverIterations;
  }
  public set solverIterations(v: number) {
    this._solverIterations = v;
    this._nativeRigidbody.setSolverIterations(v);
  }

  private _collisionDetectionMode: CollisionDetectionMode = CollisionDetectionMode.Discrete;
  public get collisionDetectionMode(): CollisionDetectionMode {
    return this._collisionDetectionMode;
  }
  public set collisionDetectionMode(v: CollisionDetectionMode) {
    this._collisionDetectionMode = v;
    this._nativeRigidbody.setCollisionDetectionMode(v);
  }

  private _isKinematic: boolean = false;
  public get isKinematic(): boolean {
    return this._isKinematic;
  }
  public set isKinematic(v: boolean) {
    this._isKinematic = v;
    this._nativeRigidbody.setIsKinematic(v);
  }

  private _constraints: DynamicRigidbodyConstraints = 0;
  public get constraints(): DynamicRigidbodyConstraints {
    return this._constraints;
  }
  public set constraints(v: DynamicRigidbodyConstraints) {
    this._constraints = v;
    this._nativeRigidbody.setConstraints(v);
  }

  override _onColliderLateUpdate(): void {
    const obj = this.entity.sceneObject;

    this.getTransform(this._tempPosition, this._tempRotation);
    const pos = objectToLocalPosition(obj, this._tempPosition);
    const rot = objectToLocalQuaternion(obj, this._tempRotation);
    this.entity.transform.position = pos;
    this.entity.transform.quaternion = rot;
    this.entity.transform._updateFlag = false;
  }

  addForce(force: IVector3) {
    this._nativeRigidbody.addForce(force);
  }

  addTorque(torque: IVector3) {
    this._nativeRigidbody.addTorque(torque);
  }

  /**
   * Moves kinematically controlled dynamic actors through the game world.
   * @param position - The desired position for the kinematic actor
   */
  move(position: IVector3): void;

  /**
   * Moves kinematically controlled dynamic actors through the game world.
   * @param rotation - The desired rotation for the kinematic actor
   */
  move(rotation: Quaternion): void;

  /**
   * Moves kinematically controlled dynamic actors through the game world.
   * @param position - The desired position for the kinematic actor
   * @param rotation - The desired rotation for the kinematic actor
   */
  move(position: IVector3, rotation: Quaternion): void;

  move(positionOrRotation: IVector3 | Quaternion, rotation?: Quaternion): void {
    this._nativeRigidbody.move(positionOrRotation, rotation);
  }

  sleep() {
    this._nativeRigidbody.sleep();
  }

  wakeUp() {
    this._nativeRigidbody.wakeUp();
  }

  updateByJson(data: any, sync: boolean): void {}

  onSerialize() {}

  onDeserialize(data: any): void {}
}
