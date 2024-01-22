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

/** How tangentLine behaves when dragged, works only when InterpMode == 'Cubic' */
export enum TangentMode {
  Auto = 'Auto', // Automatically calculates tangents
  User = 'User', // inTangent == outTangent
  Break = 'Break', // allow inTangent != outTangent
  None = 'None', // No tangents
}

export class Keyframe {
  time: number;
  value: number;
  inTangent: number;
  outTangent: number;
  inWeight: number;
  outWeight: number;
  tangentMode: TangentMode;
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
    this.tangentMode = TangentMode.Auto;
    this.time = time;
    this.value = value;
    this.inTangent = inTangent || 0;
    this.outTangent = outTangent || 0;
    this.inWeight = inWeight || 0;
    this.outWeight = outWeight || 0;
  }
}

export const isNotWeighted = (key1: Keyframe, key2: Keyframe) => {
  return (
    (key1.weightMode === WeightMode.None || key1.weightMode === WeightMode.In) &&
    (key2.weightMode === WeightMode.None || key2.weightMode === WeightMode.Out)
  );
};

export const isInWeightEnabled = (key: Keyframe) => {
  return key.weightMode == WeightMode.In || key.weightMode == WeightMode.Both;
};

export const isOutWeightEnabled = (key: Keyframe) => {
  return key.weightMode == WeightMode.Out || key.weightMode == WeightMode.Both;
};
