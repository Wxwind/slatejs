import { Collider, Script } from 'deer-engine';

export class BulletScript extends Script {
  override onCollisionEnter(other: Collider): void {
    console.log('bullet: collider enter', other._rigidbody?.entity.name);
  }

  override onCollisionStay(other: Collider): void {
    console.log('bullet: collider stay', other._rigidbody?.entity.name);
  }

  override onCollisionExit(other: Collider): void {
    console.log('bullet: collider exit', other._rigidbody?.entity.name);
  }

  override onTriggerEnter(other: Collider): void {
    console.log('bullet: trigger enter', other._rigidbody?.entity.name);
  }

  override onTriggerStay(other: Collider): void {
    console.log('bullet: trigger stay', other._rigidbody?.entity.name);
  }

  override onTriggerExit(other: Collider): void {
    console.log('bullet: trigger exit', other._rigidbody?.entity.name);
  }
}
