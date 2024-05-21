import { AnimationCurveJson, TangentMode, WeightMode, InterpMode, AnimationCurveExtrapolation } from 'deer-engine';

export const DEFAULT_CURVE_VALUE: AnimationCurveJson = {
  type: 'AnimationCurve',
  keys: [
    {
      time: 0,
      value: 0,
      tangentMode: TangentMode.User,
      weightMode: WeightMode.Both,
      interpMode: InterpMode.Cubic,
      inTangent: 0,
      outTangent: 0,
      inWeight: 0.3,
      outWeight: 0.3,
    },
    {
      time: 1,
      value: 1,
      tangentMode: TangentMode.User,
      weightMode: WeightMode.Both,
      interpMode: InterpMode.Cubic,
      inTangent: 0,
      outTangent: 0,
      inWeight: 0.3,
      outWeight: 0.3,
    },
  ],
  preExtrapolation: AnimationCurveExtrapolation.Constant,
  postExtrapolation: AnimationCurveExtrapolation.Constant,
};
