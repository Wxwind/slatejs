import CanvasKitInit, { CanvasKit } from 'canvaskit-wasm';

let canvasKit: CanvasKit | undefined = undefined;

const getCanvasKit = async () => {
  if (canvasKit) return canvasKit;
  const ck = await CanvasKitInit({
    locateFile: (file) => {
      console.log('file', file);
      return 'https://cdn.staticfile.org/canvaskit-wasm/0.39.1/' + file;
    },
  });
  canvasKit = ck;
  return ck;
};

export const getContext = async (ck: CanvasKit, canvasEl: HTMLCanvasElement) => {
  //   if (navigator.gpu && ck.webgpu) {
  //     const adapter = await navigator.gpu.requestAdapter();
  //     if (!adapter) {
  //       console.error('Failed in gpu.requestAdapter()');
  //       return;
  //     }
  //     const gpuDevice = await adapter.requestDevice();

  //     const ctx = ck.MakeGPUDeviceContext(gpuDevice);
  //     if (!ctx) {
  //       console.error('Failed to initialize WebGPU device context');
  //       return;
  //     }
  //     return ctx;
  //   }

  const context = ck.MakeWebGLContext(ck.GetWebGLContext(canvasEl));
  if (!context) {
    throw new Error('Failed to configure WebGPU canvas context');
  }

  return context;
};
