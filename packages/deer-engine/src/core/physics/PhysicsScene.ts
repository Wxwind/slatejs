import { DeerScene } from '../DeerScene';
import { RigidbodyComponent } from './RigidbodyComponent';
import { ComponentManager } from '../manager';
import { DisorderedArray } from '../DisorderedMap';
import { Vector3 } from 'three';
import { IPhysics, IPhysicsScene } from './interface';
import { CharacterControllerComponent } from './CharacterControllerComponent';

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

  private _gravity: Vector3 = new Vector3(0, -9.81, 0);

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
    this._nativePhysicsScene = PhysicsScene._nativePhysics.createScene(this.gravity);
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
  }

  _addCharacterController(cct: CharacterControllerComponent) {
    if (cct._index === -1) {
      cct._index = this._rigidbodies.length;
      this._rigidbodies.add(cct);
    }
  }

  _removeRigidbody(rb: RigidbodyComponent) {
    const replaced = this._rigidbodies.deleteByIndex(rb._index);
    replaced && (replaced._index = rb._index);
    rb._index = -1;
    this._nativePhysicsScene.removeRigidbody(rb._nativeRigidbody);
  }

  _removeCharacterController(cct: CharacterControllerComponent) {
    const replaced = this._rigidbodies.deleteByIndex(cct._index);
    replaced && (replaced._index = cct._index);
    cct._index = -1;
  }

  destroy() {
    this._nativePhysicsScene.destroy();
  }
}
