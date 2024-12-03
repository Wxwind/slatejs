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
} from 'deer-engine';

export class ControllerScript extends Script {
  private _controller!: CharacterControllerComponent;

  constructor(entity: Entity) {
    super(entity);
  }

  private _camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
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
  _jumpForce: number = 500;
  _moveForce: number = 120;

  private _maxVelocity = new THREE.Vector3(1.5, 5, 1.5);
  private _isOnGround = false;
  private _inputXZ = new THREE.Vector2();
  private _inputY: number = 0;
  private _currentVelocity = new THREE.Vector3();
  private _tempVec3 = new THREE.Vector3();

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
      this.scene.mainCamera.getWorldDirection(this._forward);

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
      inputXZ.set(lr, fb);
      if (inputManager.isKeyDown(Keys.Space) && this._isOnGround) {
        this._inputY = 1;
      } else {
        this._inputY = 0;
      }
    }
  }

  private calculateDisplacement(deltaTime: number, gravity: number) {
    const mass = this._mass;

    const lrVector3 = IVector3.scale(
      this._right,
      (this._inputXZ.x * this._moveForce * deltaTime) / mass,
      this._lrVelocity
    );

    const yForce = this._inputY > 0 ? this._inputY * this._jumpForce : gravity;
    const Vy = (yForce * deltaTime) / mass;
    const fbVector3 = IVector3.scale(
      this._forward,
      (this._inputXZ.y * this._moveForce * deltaTime) / mass,
      this._fbVelocity
    );

    const newVelocity = this._tempVec3.addVectors(lrVector3, fbVector3);
    const currentVelocity = this._currentVelocity;

    currentVelocity.x = newVelocity.x;
    currentVelocity.z = newVelocity.z;
    currentVelocity.y = this._inputY > 0 ? Vy : currentVelocity.y + Vy;
    IVector3.clampVector3(currentVelocity, this._maxVelocity, currentVelocity);

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
