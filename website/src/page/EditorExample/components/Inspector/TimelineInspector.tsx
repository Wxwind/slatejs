import { useBindSignal, useDumbState } from '@/hooks';
import { CanvasEditor, Curves } from '@/module/canvasEditor';
import { Circle } from '@/module/canvasEditor/Drawable/Circle';
import { useCanvaskitStore } from '@/store';
import { isNil } from '@/util';
import { ActionClip, AnimationCurve, CutsceneEditor, globalTypeMap } from 'deer-engine';
import { FC, useEffect, useState } from 'react';
import { getEditorRenderer } from '@/decorator';
import { Handle } from '@/module/canvasEditor/Drawable/Curves/Handle';

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
    const c = new AnimationCurve();
    c.addKey(1, -2);
    c.addKey(3, -4);
    c.addKey(8, -20);
    curves.push(c);

    const c2 = new AnimationCurve();
    c2.addKey(2, -2);
    c2.addKey(8, -8);
    c2.addKey(14, -14);
    curves.push(c2);

    curvesEditor.root.addChild(new Curves(canvasKit, curves));
    const circle = new Circle(canvasKit, { center: { x: 150, y: 80 }, radius: 20 });
    circle.addEventListener('click', () => {
      console.log('click circle');
    });
    curvesEditor.root.addChild(circle);

    const handle = new Handle(canvasKit, { center: { x: 50, y: 50 }, radius: 20 });
    curvesEditor.root.addChild(handle);

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
      <div className="w-48 h-60" id="curve-editor" />
    </div>
  );
};
