import { AnimationCurve, AnimationCurveJson } from 'deer-engine';
import { useEffect, useRef } from 'react';
import { Canvas2DRendererPlugin, DeerCanvas, Curve } from 'deer-canvas';
import { getBoundsOfCurveByKeys, isNil } from '@/util';
import { CurveEditor } from './CurveEditor';
import { DEFAULT_CURVE_VALUE } from './defaultCurveValue';
import { Trigger } from '@arco-design/web-react';

interface CurveEditorTriggerProps {
  value?: AnimationCurveJson;
  onChange?: (value: AnimationCurveJson) => void;
}

export function CurveEditorTrigger(props: CurveEditorTriggerProps) {
  const { value, onChange } = props;
  const container = useRef<HTMLDivElement | null>(null);
  const curve = useRef<Curve>();
  const curvesEditor = useRef<DeerCanvas>();

  const width = 133;
  const height = 26;

  useEffect(() => {
    if (isNil(container.current)) return;

    const editor = new DeerCanvas(
      {
        container: container.current,
        width,
        height,
        devicePixelRatio: 2,
      },
      [new Canvas2DRendererPlugin()]
    );
    curvesEditor.current = editor;
    const c = editor.createElement(Curve, {
      style: {
        disable: true,
        strokeStyle: '#ffffffff',
        lineWidth: 1,
      },
    });
    curve.current = c;
    editor.root.addChild(c);

    return () => {
      editor.dispose();
    };
  }, []);

  useEffect(() => {
    if (!curve.current || !curvesEditor.current) return;
    const c = AnimationCurve.fromJSON(value || DEFAULT_CURVE_VALUE);

    const camera = curvesEditor.current.camera;
    const { minx, maxx, miny, maxy } = getBoundsOfCurveByKeys(c.keys);

    // remap curve value to fit content
    c.keys.forEach((key) => {
      //  minx ~ maxx to 0 ~ width
      const scaleX = width / (maxx - minx);
      const scaleY = height / (maxy - miny);
      key.time = (key.time - minx) * scaleX;
      key.value = (key.value - miny) * scaleY;

      const angle = Math.atan(key.inTangent);
      const keyWeightY = key.inWeight * Math.sin(angle) * scaleY;
      const keyWeightX = key.inWeight * Math.cos(angle) * scaleX;
      key.inWeight = Math.sqrt(keyWeightX * keyWeightX + keyWeightY * keyWeightY);
      key.inTangent *= scaleY / scaleX;

      const angle2 = Math.atan(key.outTangent);
      const keyWeightY2 = key.outWeight * Math.sin(angle2) * scaleY;
      const keyWeightX2 = key.outWeight * Math.cos(angle2) * scaleX;
      key.outWeight = Math.sqrt(keyWeightX2 * keyWeightX2 + keyWeightY2 * keyWeightY2);
      key.outTangent *= scaleY / scaleX;
    });

    curve.current.setCurve(c);
    camera.setFlipY(true);
  }, [value]);

  return (
    <div>
      <Trigger trigger="click" position="bl" popup={() => <CurveEditor value={value} onChange={onChange} />}>
        <div className="flex-1 border rounded hover:border-primary border-[#FFFFFF1F] bg-[#FFFFFF0A] h-7">
          <div className="w-full h-full" ref={container}></div>
        </div>
      </Trigger>
    </div>
  );
}
