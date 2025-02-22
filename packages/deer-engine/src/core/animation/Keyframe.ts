import { egclass, property } from '../decorator';

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
  None = 'None', // No tangents can be dragged.
}

@egclass()
export class Keyframe {
  @property({ type: Number })
  time: number = 0;

  @property({ type: Number })
  value: number = 0;

  @property({ type: Number })
  inTangent: number = 0;

  @property({ type: Number })
  outTangent: number = 0;

  @property({ type: Number })
  inWeight: number = 1;

  @property({ type: Number })
  outWeight: number = 1;

  @property({ type: String })
  tangentMode: TangentMode = TangentMode.User;

  @property({ type: String })
  weightMode: WeightMode = WeightMode.Both;

  @property({ type: String })
  interpMode: InterpMode = InterpMode.Cubic;
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
