import { DeerScene } from '../DeerScene';
import { RigidbodyComponent } from './RigidbodyComponent';

import { ComponentManager } from '../manager';
import { PxPhysics } from '../../module/physics';
import { PxPhysicsScene } from '../../module/physics/PxPhysicsScene';
import { DisorderedArray } from '../DisorderedMap';

export class PhysicsScene {
  private _accumulator: number = 0;
  private _fixedDeltaTime = 1 / 60;
  private _currentFrame = 0;
  private _totalElapsedTime = 0;

  /** @readonly */
  _currentFPS = 0;
  private _accumulatedElapsedTimeInSecond = 0;
  private _accumulatedFrameCountPerSecond = 0;

  private _scene: DeerScene;

  static _physics: PxPhysics;
  private _nativePhysicsScene: PxPhysicsScene;

  private _rigidbodies = new DisorderedArray<RigidbodyComponent>();

  constructor(attachedScene: DeerScene) {
    this._scene = attachedScene;
    this._nativePhysicsScene = PhysicsScene._physics.createScene();
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
    rbs.forEach((comp) => {
      comp._onColliderUpdate();
    });
  }

  _callColliderOnLateUpdate() {
    const rbs = Array.from(this._rigidbodies._elements);
    rbs.forEach((comp) => {
      comp._onColliderLateUpdate();
    });
  }

  _addRigidbody(rb: RigidbodyComponent) {
    if (rb._index === -1) {
      rb._index = this._rigidbodies.length;
      this._rigidbodies.add(rb);
    }

    this._nativePhysicsScene.addActor(rb._nativeRigidbody);
  }

  _removeRigidbody(rb: RigidbodyComponent) {
    const replaced = this._rigidbodies.deleteByIndex(rb._index);
    replaced && (replaced._index = rb._index);
    rb._index = -1;
    this._nativePhysicsScene.removeActor(rb._nativeRigidbody);
  }

  destroy() {
    this._nativePhysicsScene.destroy();
  }
}
