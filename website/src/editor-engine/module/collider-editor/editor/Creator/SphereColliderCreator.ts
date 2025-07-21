import { Fsm, genUUID, isNil, IVector3, THREE, TransformUtils } from 'deer-engine';
import { ColliderConfig, ColliderToolType, EventMap } from '../../type';
import { ColliderToolBase } from './ColliderCreatorBase';
import { ColliderEditor } from '../ColliderEditor';
import { meshMaterialSettings } from '../../constants';
import { intersectObject, getAABBInfo } from '../../util';

export class SphereColliderCreator extends ColliderToolBase {
  readonly name: ColliderToolType = 'Sphere';
  raycaster: THREE.Raycaster = new THREE.Raycaster();
  _dom!: HTMLElement;
  rootObject!: THREE.Object3D;
  owner!: ColliderEditor;
  fsm!: Fsm<ColliderEditor>;
  object: THREE.Mesh = null!;
  startPosition: THREE.Vector3 | null = null;
  startCoords = new THREE.Vector2();
  startPlane = new THREE.Plane();
  threshold = 0.05;
  // y=0的平面
  virtualPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  override onInit(fsm: Fsm<ColliderEditor>): void {
    const owner = fsm.owner;
    const comp = owner.entity;
    const rootObject = comp.scene.sceneObject;
    this.owner = owner;
    this.rootObject = rootObject;
    this.fsm = fsm;
    this._dom = this.getCanvas();
  }

  override onEnter(fsm: Fsm<ColliderEditor>): void {
    this.initEventListeners();
    this.object = this.createObject();
    this.object.visible = false;
  }

  override onLeave(fsm: Fsm<ColliderEditor>): void {
    this.disposeEventListeners();
    //  this.owner.entity.scene.getManager(SelectManager)?.updateBoundingBox();
    if (this.object) {
      this.rootObject.remove(this.object);
      this.object = null!;
    }
    this.startPosition = null;
  }

  createObject() {
    const material = new THREE.MeshPhongMaterial(meshMaterialSettings);
    const geometry = new THREE.SphereGeometry(0.5);
    const object = new THREE.Mesh(geometry, material);
    this.rootObject.add(object);
    return object;
  }

  initEventListeners = () => {
    this._dom.addEventListener('mousedown', this.handleMouseDown);
    this._dom.addEventListener('mousemove', this.handleMouseMove);
  };

  disposeEventListeners = () => {
    this._dom.removeEventListener('mousedown', this.handleMouseDown);
    this._dom.removeEventListener('mousemove', this.handleMouseMove);
  };

  handleMouseDown = (event: MouseEvent) => {
    if (isNil(this.startPosition)) {
      this.startPosition = new THREE.Vector3();
    }
    const { raycaster, owner, virtualPlane, startPosition } = this;

    const scene = owner.entity.scene;
    const controls = scene.control;
    controls.enabled = false;
    const camera = scene.camera.main;
    // 忽略右键和中键
    if (event.button !== 0) return;

    // 更新鼠标位置
    const coords = scene.getMouseCoords(event.clientX, event.clientY);
    this.startCoords = coords;

    raycaster.setFromCamera(coords, camera);

    const intersects = intersectObject(event, raycaster, scene);

    if (intersects.length > 0) {
      console.log('相交于intersects[0].point', intersects[0].point);
      startPosition.copy(intersects[0].point);
      this.startPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), startPosition);
    } else {
      const intersectPos = raycaster.ray.intersectPlane(virtualPlane, startPosition);
      console.log('相交于y=0', intersectPos);

      if (intersectPos) {
        this.startPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), intersectPos);
      }
    }

    this._dom.addEventListener('mouseup', this.handleMouseUp);
  };

  _up = new THREE.Vector2(0, 1);
  _intersectPosition = new THREE.Vector3();
  _deltaPosition = new THREE.Vector3();
  _deltaCoords = new THREE.Vector2();
  _tempVec31 = new THREE.Vector3();

  handleMouseMove = (event: MouseEvent) => {
    const {
      raycaster,
      _intersectPosition,
      _deltaPosition,
      _deltaCoords,
      object,
      startCoords,
      startPlane,
      startPosition,
      threshold,
    } = this;
    if (isNil(startPosition)) return;
    const scene = this.owner.entity.scene;
    const coords = scene.getMouseCoords(event.clientX, event.clientY);
    const camera = scene.camera.main;

    raycaster.setFromCamera(coords, camera);
    const position = raycaster.ray.intersectPlane(startPlane, _intersectPosition);
    if (!position) return;

    const deltaCoords = _deltaCoords.subVectors(coords, startCoords);
    const deltaPosition = _deltaPosition.subVectors(position, startPosition);

    if (deltaCoords.length() > threshold) {
      // xyz平面等比例缩放,以xz中较大者为基准
      if (object.visible === false) {
        object.visible = true;
      }
      const maxScale = Math.max(Math.abs(deltaPosition.x), Math.abs(deltaPosition.z));

      object.scale.set(maxScale, maxScale, maxScale);

      object.position
        .copy(startPosition)
        .add(
          new THREE.Vector3(
            (maxScale / 2) * Math.sign(deltaPosition.x),
            maxScale / 2,
            (maxScale / 2) * Math.sign(deltaPosition.z)
          )
        );
    } else {
      object.visible = false;
    }
  };

  // 鼠标松开事件
  handleMouseUp = (event: MouseEvent) => {
    const { owner, _deltaCoords, threshold, object } = this;
    const controls = owner.entity.scene.control;
    controls.enabled = true;
    object.visible = false;
    this._dom.removeEventListener('mouseup', this.handleMouseUp);

    if (_deltaCoords.length() > threshold) {
      this.saveSettingsByObject();
    } else {
      this.saveSettingsByDefault();
    }

    this.owner.setToolType('Edit');
  };

  getCanvas = () => {
    return this.owner.entity.scene.canvas._webCanvas;
  };

  private saveSettingsByObject = () => {
    const { owner, object } = this;

    const aabb = getAABBInfo(object);
    const component = owner.entity;
    const worldScale = TransformUtils.getWorldScale(component.sceneObject, new THREE.Vector3(1, 1, 1));

    const realPosition = component.sceneObject.worldToLocal(aabb.center.clone()).divide(worldScale);
    const realRotation = TransformUtils.worldToLocalRotation(component.sceneObject, object.quaternion.clone());
    const realSize = aabb.size.clone().divide(worldScale);
    const maxRealSize = Math.max(realSize.x, realSize.y, realSize.z);

    const config: ColliderConfig = {
      id: genUUID(),
      name: '球体',
      type: 'Sphere',
      position: realPosition,
      radius: maxRealSize / 2,
      rotation: {
        x: realRotation.x * THREE.MathUtils.RAD2DEG,
        y: realRotation.y * THREE.MathUtils.RAD2DEG,
        z: realRotation.z * THREE.MathUtils.RAD2DEG,
      },
      isTrigger: false,
    };

    const params: EventMap['OnColliderCreated'] = [config];
    owner.entity.emit('OnColliderCreated', ...params);
  };

  private saveSettingsByDefault = () => {
    const { owner, startPosition, object } = this;
    if (isNil(startPosition)) return;

    const component = owner.entity;
    const worldScale = TransformUtils.getWorldScale(component.sceneObject, new THREE.Vector3(1, 1, 1));
    const realPosition = component.sceneObject.worldToLocal(startPosition.clone()).divide(worldScale);
    const realRotation = TransformUtils.worldToLocalRotation(component.sceneObject, new THREE.Quaternion(0, 0, 0, 1));
    const realSize = object.scale.clone().divide(worldScale);
    const maxRealSize = Math.max(realSize.x, realSize.y, realSize.z);

    const config: ColliderConfig = {
      id: genUUID(),
      name: '球体',
      type: 'Sphere',
      radius: maxRealSize / 2,
      position: realPosition,
      rotation: {
        x: realRotation.x * THREE.MathUtils.RAD2DEG,
        y: realRotation.y * THREE.MathUtils.RAD2DEG,
        z: realRotation.z * THREE.MathUtils.RAD2DEG,
      },
      isTrigger: false,
    };

    const params: EventMap['OnColliderCreated'] = [config];
    owner.entity.emit('OnColliderCreated', ...params);
  };
}
