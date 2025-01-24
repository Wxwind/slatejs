import {
  CharacterControllerComponent,
  Entity,
  InputManager,
  Keys,
  Script,
  THREE,
  PhysicsControllerCollisionFlag,
  objectToLocalQuaternion,
  IVector3,
  MathUtils,
} from 'deer-engine';

export enum ForceMode {
  Impulse,
  Force,
  Velocity,
}

export class CharacterControllerScript extends Script {
  private _controller!: CharacterControllerComponent;

  constructor(entity: Entity) {
    super(entity);
  }

  private _displacement = new THREE.Vector3();
  private _up = new THREE.Vector3(0, 1, 0);
  private _forward = new THREE.Vector3();
  private _right = new THREE.Vector3();
  private _predictPosition = new THREE.Vector3();
  private _lrVelocity = new THREE.Vector3();
  private _fbVelocity = new THREE.Vector3();
  private _newRotation = new THREE.Quaternion();

  private _worldPosition = new THREE.Vector3(0, 1, 0);
  private _worldQuaternion = new THREE.Quaternion();
  private _rotMat = new THREE.Matrix4();
  private _tempQuaternion = new THREE.Quaternion();
  _mass: number = 1.0;
  _jumpForce: number = 10;
  _moveForce: number = 2;
  _moveDamping: number = 8;
  _forceMode: ForceMode = ForceMode.Velocity;
  _runFactor: number = 1;
  _maxFallVelocity: number = -20;

  private _isOnGround = false;
  private _inputXZ = new THREE.Vector2();
  private _inputY: number = 0;
  private _currentVelocity = new THREE.Vector3();
  private _tempVec3 = new THREE.Vector3();
  private _isRunning = false;

  _isFirstPerson = false;

  override onAwake(): void {
    const comp = this.entity.findComponentByType<CharacterControllerComponent>('CharacterControllerComponent');
    if (!comp) {
      console.error('Missing CharacterControllerComponent');
      return;
    }
    this._controller = comp;
  }

  onUpdate(deltaTime: number): void {
    const inputManager = this.scene.getManager(InputManager);
    const inputXZ = this._inputXZ;
    inputXZ.set(0, 0);

    if (inputManager.isKeyHeldDown()) {
      const camera = this.scene.camera.main;
      camera.getWorldDirection(this._forward);

      this._forward.y = 0;
      this._forward.normalize();

      this._right.set(-this._forward.z, 0, this._forward.x);

      let fb = 0;
      if (inputManager.isKeyHeldDown(Keys.KeyW)) {
        fb += 1;
      }
      if (inputManager.isKeyHeldDown(Keys.KeyS)) {
        fb -= 1;
      }
      let lr = 0;
      if (inputManager.isKeyHeldDown(Keys.KeyA)) {
        lr -= 1;
      }
      if (inputManager.isKeyHeldDown(Keys.KeyD)) {
        lr += 1;
      }
      if (inputManager.isKeyHeldDown(Keys.ShiftLeft) || inputManager.isKeyHeldDown(Keys.ShiftRight)) {
        this._isRunning = true;
      } else {
        this._isRunning = false;
      }
      inputXZ.set(lr, fb).normalize();
      if (inputManager.isKeyDown(Keys.Space) && this._isOnGround) {
        this._inputY = 1;
      } else {
        this._inputY = 0;
      }
    }
  }

  private getVelocityFromForce(force: number, deltaTime: number, forceMode: ForceMode = this._forceMode) {
    switch (forceMode) {
      case ForceMode.Impulse:
        return force / this._mass;
      case ForceMode.Force:
        return (force * deltaTime) / this._mass;
      case ForceMode.Velocity:
        return force;
    }
  }

  private calculateDisplacement(deltaTime: number, gravity: number) {
    const lrVector3 = IVector3.scale(
      this._right,
      this._inputXZ.x * this.getVelocityFromForce(this._moveForce, deltaTime),
      this._lrVelocity
    );

    const Vy =
      this._inputY > 0
        ? this.getVelocityFromForce(this._inputY * this._jumpForce, deltaTime)
        : this._currentVelocity.y + this.getVelocityFromForce(gravity, deltaTime, ForceMode.Force);
    const fbVector3 = IVector3.scale(
      this._forward,
      this._inputXZ.y * this.getVelocityFromForce(this._moveForce, deltaTime),
      this._fbVelocity
    );

    const newVelocity = this._tempVec3
      .addVectors(lrVector3, fbVector3)
      .multiplyScalar(this._isRunning ? this._runFactor : 1);
    const currentVelocity = this._currentVelocity;

    currentVelocity.y = Vy;
    if (currentVelocity.y < this._maxFallVelocity) currentVelocity.y = this._maxFallVelocity;

    // 仅在没有操作输入即将停止时做damping
    if (MathUtils.isNearly(newVelocity.x, 0)) {
      currentVelocity.x = MathUtils.lerp(currentVelocity.x, 0, this._moveDamping * deltaTime);
      if (MathUtils.isNearlyZero(currentVelocity.x)) currentVelocity.x = 0;
    } else {
      currentVelocity.x = newVelocity.x;
    }

    if (MathUtils.isNearly(newVelocity.z, 0)) {
      currentVelocity.z = MathUtils.lerp(currentVelocity.z, 0, this._moveDamping * deltaTime);
      if (MathUtils.isNearlyZero(currentVelocity.z)) currentVelocity.z = 0;
    } else {
      currentVelocity.z = newVelocity.z;
    }

    this._tempVec3.copy(currentVelocity).multiplyScalar(deltaTime);
    this._displacement.copy(this._tempVec3);
  }

  onFixedUpdate(): void {
    const physicScene = this.scene.physicsScene;
    const gravity = physicScene.gravity;
    const fixedDeltaTime = physicScene.fixedDeltaTime;
    this.calculateDisplacement(fixedDeltaTime, gravity.y);
    const character = this._controller;
    const sceneObj = this.entity.sceneObject;
    const flag = character.move(this._displacement, 0.0001, fixedDeltaTime);
    if (flag & PhysicsControllerCollisionFlag.COLLISION_DOWN) {
      this._isOnGround = true;
    } else {
      this._isOnGround = false;
    }

    // local rotation won't change in first person
    if (this._isFirstPerson) return;
    if (this._displacement.x != 0 || this._displacement.z != 0) {
      sceneObj.getWorldPosition(this._worldPosition);
      this._predictPosition.addVectors(this._worldPosition, this._displacement);
      this._worldPosition.y = this._predictPosition.y = 0;

      this._rotMat.lookAt(this._worldPosition, this._predictPosition, this._up);
      this._tempQuaternion.setFromRotationMatrix(this._rotMat);
      const currentRot = sceneObj.getWorldQuaternion(this._worldQuaternion);
      this._newRotation.slerpQuaternions(currentRot, this._tempQuaternion, 0.1);
      const quat = objectToLocalQuaternion(sceneObj, this._newRotation);
      sceneObj.setRotationFromQuaternion(quat);
    }
  }
}
