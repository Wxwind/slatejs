import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { Camera, CameraProjectionMode, CameraTrackingMode, CameraType, ClipSpaceNearZ } from '../src/camera';
import { CanvasEditor } from '../src/CanvasEditor';
import 'isomorphic-fetch';
import { mat4, vec3 } from 'gl-matrix';
import { deg2rad } from '@/util';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const $container = document.createElement('div');
$container.id = 'container';
document.body.prepend($container);

const width = 600;
const height = 500;

const canvas = new CanvasEditor({
  container: $container,
  width,
  height,
});

describe('Camera', () => {
  test('create the ortho camera', () => {
    const camera = new Camera(canvas)
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setOrthographic(width / -2, width / 2, height / -2, height / 2, 0.1, 1000);

    expect(camera.ProjectionMode).toBe(CameraProjectionMode.ORTHOGRAPHIC);
    expect(camera.Zoom).toBe(1);
    expect(camera.Near).toBe(0.1);
    expect(camera.Far).toBe(1000);
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
    expect(camera.Distance).toBe(500);

    expect(camera.ViewTransform).toStrictEqual(
      mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -300, -250, -500, 1)
    );
    expect(camera.WorldTransform).toStrictEqual(mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 300, 250, 500, 1));

    expect(camera.ProjectionMatrix).toBeDeepCloseTo(
      mat4.fromValues(
        0.0033333334140479565,
        0,
        0,
        0,
        -0,
        0.004000000189989805,
        -0,
        -0,
        0,
        0,
        -0.0020002000965178013,
        0,
        -0,
        0,
        -1.0002000331878662,
        1
      )
    );

    expect(camera.ProjectionInverse).toBeDeepCloseTo(
      mat4.fromValues(
        300,
        -0,
        -0,
        -0,
        0,
        249.99998474121094,
        -0,
        -0,
        0,
        -0,
        -499.9499816894531,
        -0,
        -0,
        -0,
        -500.04998779296875,
        1
      )
    );

    camera.setFocalPoint(300, 250, 100);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 100));
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
    expect(camera.Distance).toBe(400);

    // nothing changed in ortho camera
    camera.setFov(60);
    camera.setAspect(2);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 100));
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));

    camera.setNear(10);
    camera.setFar(200);
    expect(camera.Far).toBe(200);
    expect(camera.Near).toBe(10);

    camera.setRoll(0);
    expect(camera.Roll).toBe(0);
    camera.setElevation(0);
    expect(camera.Elevation).toBe(0);
    camera.setAzimuth(0);
    expect(camera.Azimuth).toBe(0);
  });

  test('create the ortho(near01) camera', () => {
    const camera = new Camera(canvas);
    camera.clipSpaceNearZ = ClipSpaceNearZ.ZERO;
    camera
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setOrthographic(width / -2, width / 2, height / -2, height / 2, 0.1, 1000);

    expect(camera.ProjectionMode).toBe(CameraProjectionMode.ORTHOGRAPHIC);
    expect(camera.Zoom).toBe(1);
    expect(camera.Near).toBe(0.1);
    expect(camera.Far).toBe(1000);
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
    expect(camera.Distance).toBe(500);

    expect(camera.ViewTransform).toStrictEqual(
      mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -300, -250, -500, 1)
    );
    expect(camera.WorldTransform).toStrictEqual(mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 300, 250, 500, 1));

    expect(camera.ProjectionMatrix).toBeDeepCloseTo(
      mat4.fromValues(
        0.0033333334140479565,
        0,
        0,
        0,
        -0,
        0.004000000189989805,
        -0,
        -0,
        0,
        0,
        -0.0020002000965178013,
        0,
        -0,
        0,
        -0.00010001000191550702,
        1
      )
    );
  });

  test('create the perspective camera', () => {
    const camera = new Camera(canvas);
    camera
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setPerspective(0.1, 1000, 45, width / height);

    expect(camera.ProjectionMode).toBe(CameraProjectionMode.PERSPECTIVE);
    expect(camera.Zoom).toBe(1);
    expect(camera.Near).toBe(0.1);
    expect(camera.Far).toBe(1000);
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
    expect(camera.Distance).toBe(500);

    expect(camera.ViewTransform).toStrictEqual(
      mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -300, -250, -500, 1)
    );
    expect(camera.WorldTransform).toStrictEqual(mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 300, 250, 500, 1));

    expect(camera.ProjectionMatrix).toBeDeepCloseTo(
      mat4.fromValues(
        2.0118446350097656,
        0,
        0,
        0,
        -0,
        -2.4142136573791504,
        -0,
        -0,
        0,
        0,
        -1.0002000331878662,
        -1,
        -0,
        0,
        -0.20002000033855438,
        0
      )
    );
  });

  test('create the perspective(near0-1) camera', () => {
    const camera = new Camera(canvas);
    camera.clipSpaceNearZ = ClipSpaceNearZ.ZERO;
    camera
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setPerspective(0.1, 1000, 45, width / height);

    expect(camera.ProjectionMode).toBe(CameraProjectionMode.PERSPECTIVE);
    expect(camera.Zoom).toBe(1);
    expect(camera.Near).toBe(0.1);
    expect(camera.Far).toBe(1000);
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
    expect(camera.Distance).toBe(500);

    expect(camera.ViewTransform).toStrictEqual(
      mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -300, -250, -500, 1)
    );
    expect(camera.WorldTransform).toStrictEqual(mat4.fromValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 300, 250, 500, 1));

    expect(camera.ProjectionMatrix).toBeDeepCloseTo(
      mat4.fromValues(
        2.0118446350097656,
        0,
        0,
        0,
        -0,
        -2.4142136573791504,
        -0,
        -0,
        0,
        0,
        -1.0002000331878662,
        -1,
        -0,
        0,
        -0.10001000016927719,
        0
      )
    );
  });

  test('do pan()', () => {
    const camera = new Camera(canvas);
    camera
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setPerspective(0.1, 1000, 45, width / height);

    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));

    camera.pan(100, 50);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Position).toStrictEqual(vec3.fromValues(400, 300, 500));

    camera.pan(-100, -50);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
  });

  test('do dolly()', () => {
    const camera = new Camera(canvas);
    camera
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setPerspective(0.1, 1000, 45, width / height);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
    expect(camera.Distance).toBe(500);
    expect(camera.DollyingStep).toBe(500 / 100);

    camera.dolly(100);
    expect(camera.DollyingStep).toBe(10);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    // dollyStep = 500 / 100
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500 + (500 / 100) * 100));
    expect(camera.Distance).toBe(1000);

    // account for min & max distance
    camera.setMinDistance(100);
    camera.dolly(-100000);
    expect(camera.Distance).toBe(100);
    camera.setMaxDistance(1000);
    camera.dolly(100000);
    expect(camera.Distance).toBe(1000);

    camera.setPosition([300, 250, 500]);
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
  });

  test('do rotate()', () => {
    const camera = new Camera(canvas);
    camera
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setPerspective(0.1, 1000, 45, width / height);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
    expect(camera.Azimuth).toBeCloseTo(0);
    expect(camera.Elevation).toBeCloseTo(0);
    expect(camera.Roll).toBeCloseTo(0);

    camera.rotate(30, 0, 0);
    expect(camera.Azimuth).toBeCloseTo(30);
    expect(camera.Elevation).toBeCloseTo(0);
    expect(camera.Roll).toBeCloseTo(0);

    camera.rotate(0, 30, 0);
    expect(camera.Azimuth).toBeCloseTo(30);
    expect(camera.Elevation).toBeCloseTo(30);
    expect(camera.Roll).toBeCloseTo(0);

    camera.rotate(0, 0, 30);
    expect(camera.Azimuth).toBeCloseTo(30);
    expect(camera.Elevation).toBeCloseTo(30);
    expect(camera.Roll).toBeCloseTo(30);
  });

  test('should CameraType.ORBITING work', () => {
    const camera = new Camera(canvas);
    camera
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setPerspective(0.1, 1000, 45, width / height);

    camera.setType(CameraType.ORBITING);

    expect(camera.Type).toBe(CameraType.ORBITING);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Position).toStrictEqual(vec3.fromValues(300, 250, 500));
    expect(camera.Azimuth).toBeCloseTo(0);
    expect(camera.Elevation).toBeCloseTo(0);
    expect(camera.Roll).toBeCloseTo(0);
    expect(camera.Distance).toBeCloseTo(500);

    camera.rotate(0, 0, 30);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Distance).toBeCloseTo(500);
    expect(camera.Forward).toBeDeepCloseTo(vec3.fromValues(0, 0, 1));
    expect(camera.Up).toBeDeepCloseTo(vec3.fromValues(-Math.sin(deg2rad(30)), Math.cos(deg2rad(30)), 0));
    expect(camera.Right).toBeDeepCloseTo(vec3.fromValues(Math.cos(deg2rad(30)), Math.sin(deg2rad(30)), 0));
    expect(camera.Forward).toBeDeepCloseTo(vec3.fromValues(0, 0, 1));

    camera.rotate(30, 0, 0);
    const exvec1 = vec3.fromValues(300 - 500 * Math.sin(deg2rad(30)), 250, 500 * Math.cos(deg2rad(30)));
    expect(camera.Azimuth).toBeCloseTo(30);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Distance).toBeCloseTo(500);
    expect(camera.Position).toBeDeepCloseTo(exvec1);

    camera.rotate(0, 40, 0);
    const a = 500 * Math.cos(deg2rad(40));
    const b = 500 * Math.sin(deg2rad(40));
    const exvec2 = vec3.fromValues(300 - a * Math.sin(deg2rad(30)), 250 + b, a * Math.cos(deg2rad(30)));
    expect(camera.Elevation).toBeCloseTo(40);
    expect(camera.FocalPoint).toStrictEqual(vec3.fromValues(300, 250, 0));
    expect(camera.Distance).toBeCloseTo(500);
    expect(camera.Position).toBeDeepCloseTo(exvec2);
  });

  test('should CameraType.TRACKING work', () => {
    const camera = new Camera(canvas);
    camera
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setPerspective(0.1, 1000, 45, width / height);

    camera.setType(CameraType.TRACKING, CameraTrackingMode.ROTATIONAL);
    const focalToWatch = vec3.fromValues(300, 250, 0);
    const camPos = vec3.fromValues(300, 250, 500);

    expect(camera.Type).toBe(CameraType.TRACKING);
    expect(camera.FocalPoint).toStrictEqual(focalToWatch);
    expect(camera.Position).toStrictEqual(camPos);
    expect(camera.Azimuth).toBeCloseTo(0);
    expect(camera.Elevation).toBeCloseTo(0);
    expect(camera.Roll).toBeCloseTo(0);
    expect(camera.Distance).toBeCloseTo(500);

    camera.rotate(0, 0, 30);
    expect(camera.FocalPoint).toStrictEqual(focalToWatch);
    expect(camera.Distance).toBeCloseTo(500);
    expect(camera.Forward).toBeDeepCloseTo(vec3.fromValues(0, 0, 1));
    expect(camera.Up).toBeDeepCloseTo(vec3.fromValues(-Math.sin(deg2rad(30)), Math.cos(deg2rad(30)), 0));
    expect(camera.Right).toBeDeepCloseTo(vec3.fromValues(Math.cos(deg2rad(30)), Math.sin(deg2rad(30)), 0));
    expect(camera.Forward).toBeDeepCloseTo(vec3.fromValues(0, 0, 1));

    camera.rotate(30, 0, 0);
    const exvec1 = vec3.fromValues(300 - 500 * Math.sin(deg2rad(30)), 250, 500 - 500 * Math.cos(deg2rad(30)));
    expect(camera.Azimuth).toBeCloseTo(30);
    expect(camera.FocalPoint).toBeDeepCloseTo(exvec1);
    expect(camera.Distance).toBeCloseTo(500);
    expect(camera.Position).toBeDeepCloseTo(camPos);

    camera.rotate(0, 40, 0);
    const a = 500 * Math.cos(deg2rad(40));
    const b = 500 * Math.sin(deg2rad(40));
    const exvec2 = vec3.fromValues(300 - a * Math.sin(deg2rad(30)), 250 + b, 500 - a * Math.cos(deg2rad(30)));
    expect(camera.Elevation).toBeCloseTo(40);
    expect(camera.FocalPoint).toBeDeepCloseTo(exvec2);
    expect(camera.Distance).toBeCloseTo(500);
    expect(camera.Position).toBeDeepCloseTo(camPos);
  });
});
