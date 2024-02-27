import { useBindSignal, useDumbState } from '@/hooks';
import { CanvasEditor, Curves } from '@/module/canvasEditor';
import { useCanvaskitStore } from '@/store';
import { isNil } from '@/util';
import { ActionClip, AnimationCurve, CutsceneEditor, Keyframe, globalTypeMap } from 'deer-engine';
import { FC, useEffect, useState } from 'react';
import { getEditorRenderer } from '@/decorator';
import { Handle } from '@/module/canvasEditor/Drawable/Curves/Handle';
import { CoordinateSystem } from '@/module/canvasEditor/Drawable/CoordinateSystem';
import { CanvasRenderingContext } from '@/module/canvasEditor/interface';

interface TimelineInspectorProps {
  cutsceneEditor: CutsceneEditor;
}

export const TimelineInspector: FC<TimelineInspectorProps> = (props) => {
  const { cutsceneEditor } = props;
  const { getCanvaskit } = useCanvaskitStore();
  const canvasKit = getCanvaskit();
  const [curvesEditor, setCurvesEditor] = useState<CanvasEditor>();

  const selectedClip = cutsceneEditor.selectedClip;
  const refresh = useDumbState();
  useBindSignal(cutsceneEditor.signals.selectedClipUpdated, refresh);

  useEffect(() => {
    if (isNil(canvasKit)) return;
    const curvesEditor = new CanvasEditor(canvasKit, { containerId: 'curve-editor' });
    setCurvesEditor(curvesEditor);
    const curves: AnimationCurve[] = [];

    const c1 = new AnimationCurve();
    const k0 = new Keyframe();
    k0.time = 1;
    k0.value = 2;
    c1.addKey(k0);
    const k1 = new Keyframe();
    k1.time = 3;
    k1.value = 3;
    c1.addKey(k1);
    const k2 = new Keyframe();
    k2.time = 5;
    k2.value = 5;
    c1.addKey(k2);
    curves.push(c1);

    const c2 = new AnimationCurve();
    const k3 = new Keyframe();
    k3.time = 2;
    k3.value = 2;
    c2.addKey(k3);
    const k4 = new Keyframe();
    k4.time = 3;
    k4.value = 7;
    c2.addKey(k4);
    const k5 = new Keyframe();
    k5.time = 5;
    k5.value = 5;
    c2.addKey(k5);
    curves.push(c2);

    const context: CanvasRenderingContext = {
      canvaskit: canvasKit,
      root: curvesEditor.root,
      viewScaleInfo: {
        scale: 2,
      },
      viewSizeInfo: { width: 320, height: 320 },
    };

    const coord = new CoordinateSystem(context);
    coord.addChild(new Curves(context, curves));
    curvesEditor.root.addChild(coord);

    return () => {
      curvesEditor.dispose();
    };
  }, [canvasKit]);

  const getUICompFromType = (object: ActionClip | undefined) => {
    if (!object) return <div>not select any clip.</div>;
    const ctor = globalTypeMap.get(object.constructor.name);
    if (isNil(ctor))
      return (
        <div>
          {object?.type}----{object.constructor.name}
        </div>
      );
    const comp = getEditorRenderer(ctor);
    return <div>{comp({ target: object })}</div>;
  };

  return (
    <div className="flex-1 w-full break-words">
      <div>{getUICompFromType(selectedClip)}</div>
      <div>------------</div>
      <div>CurveEditor</div>
      <div style={{ width: 300, height: 400 }} id="curve-editor" />
    </div>
  );
};
