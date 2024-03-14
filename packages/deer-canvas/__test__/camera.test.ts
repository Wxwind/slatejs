import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import { Camera, CameraProjectionMode } from '../src/camera';
import { CanvasEditor } from '../src/CanvasEditor';
import 'isomorphic-fetch';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const $container = document.createElement('div');
$container.id = 'container';
document.body.prepend($container);

describe('Camera', () => {
  test('create the camera', () => {
    const width = 400;
    const height = 300;

    const canvas = new CanvasEditor({
      container: $container,
      width,
      height,
    });

    const camera = new Camera(canvas)
      .setPosition(width / 2, height / 2, 500)
      .setFocalPoint(width / 2, height / 2, 0)
      .setOrthographic(width / -2, width / 2, height / -2, height / 2, 0.1, 1000);

    expect(camera.ProjectionMode).toBe(CameraProjectionMode.ORTHOGRAPHIC);
    expect(camera.Zoom).toBe(1);
    expect(1 + 1).toBe(2);
  });
});
