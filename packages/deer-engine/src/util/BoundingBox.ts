import * as THREE from 'three';

export class BoundingBox extends THREE.Object3D {
  public box: THREE.Box3 = new THREE.Box3();

  public borderLine: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;

  /**
   *
   * @param root 包围盒生成的父物体
   * @param objects 包围盒是否union物体
   * @param id
   */
  constructor(objects: THREE.Object3D[] = [], id?: string) {
    super();

    objects.forEach((obj) => {
      this.box.union(new THREE.Box3().setFromObject(obj));
    });
    this.borderLine = this.createBorderLine(this.box);
    this.add(this.borderLine);
  }

  public static setFromBox(box: THREE.Box3): BoundingBox {
    const bBox = new BoundingBox();
    bBox.box = box;
    bBox.borderLine = bBox.createBorderLine(bBox.box);
    bBox.add(bBox.borderLine);

    return bBox;
  }

  public updateFromBox(box3: THREE.Box3 = this.box): void {
    this.box = box3;
    this.updateBorderLine(box3, this.borderLine);
  }

  public setColor(r: number, g: number, b: number): void {
    const { geometry } = this.borderLine;
    const color = geometry.getAttribute('color');
    const array: number[] = [];
    for (let i = 0; i < color.count; i++) {
      array.push(r, g, b);
    }
    const attr = new THREE.Float32BufferAttribute(array, 3);
    geometry.setAttribute('color', attr);
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public createBorderLine(box: THREE.Box3): THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial> {
    const points = [
      [-1, -1, -1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
      [1, -1, 1],
      [1, 1, -1],
    ];

    /**
     *  p1-p3 p2-p8 p7-p5 p4-p6
     *  p1-p4 p2-p7 p8-p5 p3-p6
     *  p1-p2 p4-p7 p6-p5 p3-p8
     */

    const indices = [0, 2, 1, 7, 6, 4, 3, 5, 0, 3, 1, 6, 7, 4, 2, 5, 0, 1, 3, 6, 5, 4, 2, 7];
    const positions: number[] = [];
    indices.forEach((index) => {
      positions.push(...points[index]);
    });

    const colors = [];
    const colorIndices = [];
    for (let i = 0; i < positions.length / 3; i++) {
      colors.push(0.211, 0.443, 0.878);
      colorIndices.push(i);
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(colorIndices), 1));
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.LineBasicMaterial({ vertexColors: true, toneMapped: false });

    const border = new THREE.LineSegments(geometry, material);
    this.updateBorderLine(box, border);

    return border;
  }

  public updateBorderLine(
    box: THREE.Box3 = this.box,
    borderLine: THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial> = this.borderLine
  ) {
    box.getCenter(borderLine.position);
    box.getSize(borderLine.scale);
    borderLine.scale.multiplyScalar(0.5);
  }
}
