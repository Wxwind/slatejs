import { AnimationCurve, AnimationCurveJson } from 'deer-engine';
import { useEffect, useRef } from 'react';
import { Canvas2DRendererPlugin, DeerCanvas, ControlPlugin, CoordinatePlugin, Curve } from 'deer-canvas';
import { DEFAULT_CURVE_VALUE } from './defaultCurveValue';
import { getBoundsOfCurveByKeys, isNil } from '@/util';

interface CurveEditorProps {
  value?: AnimationCurveJson;
  onChange?: (value: AnimationCurveJson) => void;
}

export function CurveEditor(props: CurveEditorProps) {
  const { value, onChange } = props;
  const curve = useRef<Curve>();
  const editor = useRef<DeerCanvas>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNil(containerRef.current)) return;

    const curvesEditor = new DeerCanvas(
      {
        container: containerRef.current,
        width: 208,
        height: 200,
        devicePixelRatio: 2,
      },
      [
        new Canvas2DRendererPlugin({ forceSkipClear: true }),
        new ControlPlugin({ minZoom: 16, maxZoom: 1600 }),
        new CoordinatePlugin(),
      ]
    );

    const c = curvesEditor.createElement(Curve, {
      style: {
        strokeStyle: '#ffffffff',
        lineWidth: 2,
        lineStyle: {
          lineWidth: 2,
          hitBias: 2,
        },
        keyStyle: {
          strokeStyle: '#ff0000',
          radius: 3,
          hitBias: 2,
        },
        handleStyle: {
          radius: 3,
          hitBias: 2,
        },
        minX: 0,
        maxX: 1,
      },
    });
    curvesEditor.root.addChild(c);

    const v = value || DEFAULT_CURVE_VALUE;
    const { minx, maxx, miny, maxy } = getBoundsOfCurveByKeys(v.keys);
    const camera = curvesEditor.camera;
    const { width, height } = curvesEditor.getConfig();
    const centerx = (minx + maxx) / 2;
    const centery = (miny + maxy) / 2;
    const zoomX = width / (maxx - minx);
    const zoomY = height / (maxy - miny);
    console.log(minx, maxx, miny, maxy, v.keys, centerx, centery);
    camera.setPosition(centerx, centery);
    camera.setFocalPoint(centerx, centery);
    camera.setZoom([zoomX * 0.7, zoomY * 0.7]);
    curve.current = c;
    editor.current = curvesEditor;

    return () => {
      curvesEditor.dispose();
    };
    // 仅在首次打开编辑器时调整相机
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!curve.current || !editor.current) return;
    const c = value || DEFAULT_CURVE_VALUE;
    curve.current.setCurve(AnimationCurve.fromJSON(c));
    curve.current.signals.onDragEnd.on((data) => {
      data && onChange?.(data);
    });
  }, [onChange, value]);

  return (
    <div className='bg-bgColor17171A rounded border border-FFFFFF1F"'>
      <div style={{ width: 208, height: 200 }} ref={containerRef} />
    </div>
  );
}
