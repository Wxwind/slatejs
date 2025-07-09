export default class HDRImage extends HTMLCanvasElement {
  src: string;
  exposure: number;
  gamma: number;
  dataFloat: Float32Array;
  dataRGBE: Uint8Array;

  floatToRgbe(buffer: any, res?: Uint8Array): Uint8Array;
  rgbeToFloat(buffer: Uint8Array, res?: Float32Array): Float32Array;

  floatToRgb9_e5(buffer: any, res?: Uint32Array): Uint32Array;
  rgb9_e5ToFloat(buffer: any, res?: Float32Array): Float32Array;

  rgbeToLDR(buffer: Uint8Array, exposure?: float, gamma?: float, res?: any[]): any[] | undefined;
  floatToLDR(buffer: Float32Array, exposure?: float, gamma?: float, res?: any[]): any[] | undefined;
}
