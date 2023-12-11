/** The tangent weight mode uesd for cubic interpolation  */
export enum WeightMode {
  None = 'None',
  In = 'In',
  Out = 'Out',
  Both = 'Both',
}

/** The Mode uesd for interpolation between the keyframe and its next keyframe */
export enum InterpMode {
  Constant = 'Constant',
  Linaer = 'Linear',
  Cubic = 'Cubic',
}

export class Keyframe {
  time: number;
  value: number;
  inTangent: number;
  outTangent: number;
  inWeight: number;
  outWeight: number;
  weightMode: WeightMode;
  interpMode: InterpMode;

  constructor(time: number, value: number);
  constructor(time: number, value: number, inTangent: number, outTangent: number);
  constructor(time: number, value: number, inTangent: number, outTangent: number, inWeight: number, outWeight: number);
  constructor(
    time: number,
    value: number,
    inTangent?: number,
    outTangent?: number,
    inWeight?: number,
    outWeight?: number
  ) {
    this.weightMode = WeightMode.None;
    this.interpMode = InterpMode.Linaer;
    this.time = time;
    this.value = value;
    this.inTangent = inTangent || 0;
    this.outTangent = outTangent || 0;
    this.inWeight = inWeight || 0;
    this.outWeight = outWeight || 0;
  }
}
