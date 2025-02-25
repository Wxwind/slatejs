import { BoxCollider, DynamicRigidbodyComponent, InputManager, Keys, MeshComponent, Script, THREE } from 'deer-engine';
import { BulletScript } from './BulletScript';
import { CollEventTestScript } from './CollEventTest';

export class ShootScript extends Script {
  private _tempVec31 = new THREE.Vector3();
  private _tempVec32 = new THREE.Vector3();
  _shootVelocity = 1000;
  _bulletSize = new THREE.Vector3(0.5, 0.5, 0.5);

  onUpdate(deltaTime: number): void {
    if (this.scene.getManager(InputManager).isKeyDown(Keys.KeyF)) {
      const camera = this.scene.camera.main;
      const _forward = camera.getWorldDirection(this._tempVec31);
      const _position = camera.getWorldPosition(this._tempVec32);
      _forward.y = 0;
      const bullet = this.createBullet(_position, this._bulletSize);
      bullet.addForce(_forward.multiplyScalar(this._shootVelocity));
    }
  }

  createBullet(position: THREE.Vector3, size: THREE.Vector3): DynamicRigidbodyComponent {
    const e = this.scene.entityManager.createEntity('obstacle', null);
    e.transform.position = position;
    e.transform.scale = size;
    const mesh = e.addComponent(MeshComponent);
    mesh.color = new THREE.Color('red');
    const rb = e.addComponent(DynamicRigidbodyComponent);
    e.addComponent(CollEventTestScript);
    const boxCollider = new BoxCollider();
    boxCollider.size = size;
    rb.addCollider(boxCollider);
    return rb;
  }
}
