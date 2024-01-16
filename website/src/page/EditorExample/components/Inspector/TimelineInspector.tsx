import { useBindSignal, useDumbState } from '@/hooks';
import { useGetCanvasKit } from '@/hooks/useGetCanvasKit';
import { CavansEditor, Curves } from '@/module/canvasEditor';
import { CutsceneEditor } from 'deer-engine';
import { isNil } from 'lodash';
import { FC, useEffect, useState } from 'react';

interface TimelineInspectorProps {
  cutsceneEditor: CutsceneEditor;
}

export const TimelineInspector: FC<TimelineInspectorProps> = (props) => {
  const { cutsceneEditor } = props;
  const canvasKit = useGetCanvasKit();
  const [curvesEditor, setCurvesEditor] = useState<CavansEditor>();

  const selectedClip = cutsceneEditor.selectedClip;
  const refresh = useDumbState();
  useBindSignal(cutsceneEditor.signals.selectedClipUpdated, refresh);

  useEffect(() => {
    if (isNil(canvasKit)) return;
    const curvesEditor = new CavansEditor(canvasKit, { containerId: 'curve-editor' });
    setCurvesEditor(curvesEditor);
    curvesEditor.addDrawables(new Curves(canvasKit));

    return () => {
      curvesEditor.dispose();
    };
  }, [canvasKit]);

  return (
    <div className="flex-1">
      <div>CurveEditor</div>
      <div className=" w-48 h-60" id="curve-editor" />
    </div>
  );
};
