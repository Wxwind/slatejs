import { Component, Entity, THREE, TransformUtils } from 'deer-engine';
import { IEditHelper } from './IEditHelper';
import { ControlPointColors } from '../../constants';
import { getAABBInfo, abs } from '../../util';
import { ControlPointUserData, DragParams, ColliderConfig, EventMap } from '../../type';
import { CapsuleColliderObj } from '@/editor-engine/module/three-collider';

export class CapsuleEditHelper implements IEditHelper {
  controlPoints: THREE.Mesh[] = [];
  scene: THREE.Object3D;
  activePoint: THREE.Mesh | null = null;

  raycaster: THREE.Raycaster = new THREE.Raycaster();

  _dom: HTMLElement;

  constructor(
    private owner: Entity,
    private object: CapsuleColliderObj
  ) {
    const scene = owner.scene.sceneObject;
    this.scene = scene;
    this._dom = this.getCanvas();
    object.userData._editor = this;
  }

  onEnter(): void {
    this.createControlPoints(getAABBInfo(this.object).size);

    this.initEventListeners();
  }

  onUpdate(dt: number): void {
    const { object, owner } = this;
    const scene = owner.scene;
    const camera = scene.camera.main;

    const distance = camera.position.distanceTo(object.position);
    const renderer = scene.renderer;
    const targetPixelSize = 20;
    const pixelRatio = renderer.getPixelRatio();
    const height = renderer.domElement.height / pixelRatio;

    // 计算世界空间的缩放因子
    const scaleFactor =
      (targetPixelSize / height) * (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) * distance;

    // 设置缩放（假设对象原始大小为1个单位）
    this.controlPoints.forEach((object) => object.scale.setScalar(scaleFactor));
  }

  onLeave(): void {
    this.clearControlPoints();
    this.disposeEventListeners();
    //  this.owner.scene.getManager(SelectManager)?.updateBoundingBox();
  }

  onDestroy(): void {}

  createControlPoints(size: THREE.Vector3) {
    // 清除旧控制点
    const { controlPoints, scene } = this;
    this.clearControlPoints();

    // --------
    //  |y
    //  5-------1
    //  |\      |\
    //  | \     | \
    //  |  4----|--0
    //  7--|----3  |
    //   \ |     \ |
    //    \|      \|
    //     6-------2 ->x
    //      \z
    // 八个角点

    const positions = [
      new THREE.Vector3(1, 1, 1), // 右上前
      new THREE.Vector3(1, 1, -1), // 右上后
      new THREE.Vector3(1, -1, 1), // 右下前
      new THREE.Vector3(1, -1, -1), // 右下后
      new THREE.Vector3(-1, 1, 1), // 左上前
      new THREE.Vector3(-1, 1, -1), // 左上后
      new THREE.Vector3(-1, -1, 1), // 左下前
      new THREE.Vector3(-1, -1, -1), // 左下后
    ];

    const { center } = getAABBInfo(this.object);
    const halfSize = size.clone().multiplyScalar(0.5);
    positions.forEach((pos, index) => {
      const material = new THREE.MeshPhongMaterial({
        color: ControlPointColors.Normal,
        depthTest: false,
        depthWrite: false,
        // 为了遮挡半透明物体
        transparent: true,
        opacity: 1,
      });
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const controlPoint = new THREE.Mesh(geometry, material);
      controlPoint.renderOrder = 10;
      controlPoint.castShadow = false;
      controlPoint.receiveShadow = false;

      controlPoint.position.copy(pos.clone().multiply(halfSize).add(center));
      controlPoint.userData = {
        id: index,
        sign: pos.clone(),
        originalPos: controlPoint.position.clone(),
      };

      scene.add(controlPoint);
      controlPoints.push(controlPoint);
    });
  }

  clearControlPoints() {
    const { controlPoints, scene } = this;
    controlPoints.forEach((p) => scene.remove(p));
    controlPoints.length = 0;
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
    const { raycaster, owner, controlPoints, yPlane } = this;
    const scene = owner.scene;
    const controls = owner.scene.control;
    const camera = this.owner.scene.camera.main;
    // 忽略右键和中键
    if (event.button !== 0) return;

    // 更新鼠标位置
    const coords = this.owner.scene.getMouseCoords(event.clientX, event.clientY);

    // 检测控制点
    raycaster.setFromCamera(coords, camera);
    const intersects = raycaster.intersectObjects(controlPoints);

    if (intersects.length > 0) {
      const activePoint = intersects[0].object as THREE.Mesh;

      const material = activePoint.material as THREE.MeshPhongMaterial;
      material.color.set(ControlPointColors.Selected);

      const activeSign = (activePoint.userData as ControlPointUserData).sign;
      const diagonalPoint = this.controlPoints.find((a) => {
        const sign = (a.userData as ControlPointUserData).sign;
        return sign.x === -activeSign.x && sign.y === -activeSign.y && sign.z === -activeSign.z;
      });

      if (!diagonalPoint) {
        throw new Error("activePoint has't diagonal point");
      }

      const diagonalPoint2D = this.controlPoints.find((a) => {
        const sign = (a.userData as ControlPointUserData).sign;
        return sign.x === -activeSign.x && sign.y === activeSign.y && sign.z === -activeSign.z;
      });

      if (!diagonalPoint2D) {
        throw new Error("activePoint has't diagonal point in xz dimension");
      }

      // 存储初始状态
      this.activePoint = activePoint;

      const diagonalVector = activePoint.position.clone().sub(diagonalPoint2D.position);

      const aabb = getAABBInfo(this.object);
      const dragParams: DragParams = {
        initCoords: coords,
        initSize: aabb.size.clone(),
        initScale: this.object.scale.clone(),
        pointSign: activePoint.userData.sign.clone(),
        startPosition: activePoint.position.clone(),
        fixedPointWorldPos: diagonalPoint.position.clone(),
        diagonalVector: diagonalVector,
      };

      activePoint.userData.dragParams = dragParams;

      const c = dragParams.startPosition.clone();
      c.y = c.y + 1;
      yPlane.setFromCoplanarPoints(dragParams.startPosition, dragParams.fixedPointWorldPos, c);
      yPlane.normal.normalize();

      // 阻止相机控制
      controls.enabled = false;
    }

    this._dom.addEventListener('mouseup', this.handleMouseUp);
  };

  _up = new THREE.Vector2(0, 1);
  _tempVec1 = new THREE.Vector3();
  _tempVec2 = new THREE.Vector3();
  yPlane = new THREE.Plane();
  handleMouseMove = (event: MouseEvent) => {
    const { activePoint, raycaster, yPlane, _tempVec1, _tempVec2, object } = this;
    const scene = this.owner.scene;
    const camera = scene.camera.main;

    if (activePoint) {
      const { initSize, initScale, fixedPointWorldPos, pointSign } = (activePoint.userData as ControlPointUserData)
        .dragParams;
      const coords = scene.screenToNdcPos(
        { x: event.clientX, y: event.clientY },
        new THREE.Vector3()
      ) as unknown as THREE.Vector2;

      raycaster.setFromCamera(coords, camera);

      const intersection = raycaster.ray.intersectPlane(yPlane, _tempVec1);
      if (!intersection) return;
      // 防止圆柱体部分高度小于0
      const diameter = Math.abs(intersection.x - fixedPointWorldPos.x);
      if (pointSign.y * (intersection.y - fixedPointWorldPos.y - diameter) < 0) {
        intersection.y = fixedPointWorldPos.y + (diameter + 0.1) * pointSign.y;
      }

      activePoint.position.copy(intersection);
      const newSize = abs(_tempVec1.copy(activePoint.position).sub(fixedPointWorldPos));
      const newCenter = _tempVec2.copy(activePoint.position).add(fixedPointWorldPos).multiplyScalar(0.5);

      // 应用新尺寸
      object.radius = diameter / 2;
      object.height = newSize.y - diameter;
      // object.scale.copy(initScale).multiply(newSize.clone().divide(initSize));
      TransformUtils.setWorldPosition(object, newCenter);

      // 更新其他控制点位置
      this.updateControlPoints();
    }
  };

  // 鼠标松开事件
  handleMouseUp = (event: MouseEvent) => {
    const { activePoint, owner } = this;
    const controls = owner.scene.control;
    if (activePoint) {
      // 重置控制点颜色
      const material = activePoint.material as THREE.MeshStandardMaterial;
      material.color.set(ControlPointColors.Normal);
      this.activePoint = null;

      // 重新启用相机控制
      controls.enabled = true;
      this.saveSettings();
    }

    this._dom.removeEventListener('mouseup', this.handleMouseUp);
  };

  getCanvas = () => {
    return this.owner.scene.canvas._webCanvas;
  };

  // 更新所有控制点位置
  updateControlPoints = () => {
    const { activePoint } = this;
    const aabb = getAABBInfo(this.object);
    const halfSize = aabb.size.multiplyScalar(0.5);

    this.controlPoints.forEach((point) => {
      const userData = point.userData as ControlPointUserData;
      if (point !== activePoint) {
        point.position.copy(userData.sign).multiply(halfSize).add(aabb.center);
      }

      userData.originalPos = point.position.clone();
    });
  };

  private saveSettings() {
    const { owner, object, _tempVec1 } = this;

    const scale = object.scale;
    const scaleMaxNumXZ = Math.max(scale.x, scale.z);
    const worldScale = TransformUtils.getWorldScale(owner.sceneObject, new THREE.Vector3(1, 1, 1));
    const worldScaleMaxXZ = Math.max(worldScale.x, worldScale.z);

    const realPosition = object.position.clone().divide(worldScale);
    const realRotation = object.rotation;
    const realRadius = (object.radius * scaleMaxNumXZ) / worldScaleMaxXZ;
    const realHeight = ((object.height + object.radius * 2) * scale.y) / worldScale.y - 2 * realRadius;

    const config: ColliderConfig = {
      id: object.userId,
      name: object.name,
      type: 'Capsule',
      height: realHeight,
      radius: realRadius,
      position: realPosition,
      rotation: {
        x: realRotation.x * THREE.MathUtils.RAD2DEG,
        y: realRotation.y * THREE.MathUtils.RAD2DEG,
        z: realRotation.z * THREE.MathUtils.RAD2DEG,
      },
      isTrigger: object.isTrigger,
    };

    const params: EventMap['OnColliderUpdated'] = [object.userId, config];
    owner.emit('OnColliderUpdated', ...params);
  }
}
