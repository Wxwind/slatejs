import { ContextListItem } from '@/components';
import {
  DeerCanvas,
  Curve,
  ContextMenuType,
  Canvas2DRendererPlugin,
  ControlPlugin,
  CoordinatePlugin,
} from 'deer-canvas';
import { ActionClip, AnimationCurve, InterpMode, Keyframe } from 'deer-engine';
import { useEffect, useRef, useState } from 'react';
import { Dropdown, Menu } from '@arco-design/web-react';
import { isNil } from '@/util';

interface CurveEditorProps {
  selectedClip: ActionClip | undefined;
}

export function CurveEditor(props: CurveEditorProps) {
  const { selectedClip } = props;
  const [curvesEditor, setCurvesEditor] = useState<DeerCanvas>();
  const [contextList, setContextList] = useState<ContextListItem[]>([{ name: 'hello' }]);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNil(containerRef.current)) return;

    const curvesEditor = new DeerCanvas(
      {
        container: containerRef.current,
        width: 300,
        height: 400,
        devicePixelRatio: 2,
      },
      [
        new Canvas2DRendererPlugin({ forceSkipClear: true }),
        new ControlPlugin({ minZoom: 16, maxZoom: 1600 }),
        new CoordinatePlugin(),
      ]
    );
    setCurvesEditor(curvesEditor);
    const camera = curvesEditor.camera;
    camera.setPosition(4, 5);
    camera.setFocalPoint(4, 5);
    camera.setZoom([32, 32]);
    curvesEditor.eventEmitter.addListener('DisplayObjectContextMenu', (e, key, type) => {
      if (type === ContextMenuType.Handle) {
        setContextList([
          {
            name: 'set interp mode',
            children: [
              {
                name: 'constant',
                onSelect: () => {
                  key.interpMode = InterpMode.Constant;
                },
              },
              {
                name: 'linear',
                onSelect: () => {
                  key.interpMode = InterpMode.Linaer;
                },
              },
              {
                name: 'cubic',
                onSelect: () => {
                  key.interpMode = InterpMode.Cubic;
                },
              },
            ],
          },
        ]);
        setIsContextMenuOpen(true);
      }
    });

    console.log(selectedClip);
    const curves = selectedClip?.animatedData.animatedParamArray.map((a) => a.curves).flat() || [];
    // const curves: AnimationCurve[] = [];

    // const c1 = new AnimationCurve();
    // const k0 = new Keyframe();
    // k0.time = 1;
    // k0.value = 2;
    // c1.addKey(k0);
    // const k1 = new Keyframe();
    // k1.time = 3;
    // k1.value = 3;
    // c1.addKey(k1);
    // const k2 = new Keyframe();
    // k2.time = 5;
    // k2.value = 5;
    // c1.addKey(k2);
    // curves.push(c1);

    // const c2 = new AnimationCurve();
    // const k3 = new Keyframe();
    // k3.time = 2;
    // k3.value = 2;
    // c2.addKey(k3);
    // const k4 = new Keyframe();
    // k4.time = 3;
    // k4.value = 7;
    // c2.addKey(k4);
    // const k5 = new Keyframe();
    // k5.time = 5;
    // k5.value = 5;
    // c2.addKey(k5);
    // curves.push(c2);
    curves.forEach((curve) => {
      const c = curvesEditor.createElement(Curve, {});
      curvesEditor.root.addChild(c);
      curve.signals.curveChanged.addListener(() => {
        selectedClip?.animatedData.signals.updated.emit();
      });
      c.setCurve(curve);
    });

    return () => {
      curvesEditor.dispose();
    };
  }, [selectedClip]);

  const renderDropList = (list: ContextListItem[]) => (
    <>
      {list.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <Menu.SubMenu key={item.name} title={item.name}>
              {renderDropList(item.children)}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item key={item.name} onClick={item.onSelect}>
            {item.name}
          </Menu.Item>
        );
      })}
    </>
  );

  return (
    <div>
      <div>CurveEditor</div>
      <Dropdown
        trigger="contextMenu"
        position="bl"
        popupVisible={isContextMenuOpen}
        onVisibleChange={(v) => {
          !v && setIsContextMenuOpen(v);
        }}
        droplist={<Menu>{renderDropList(contextList)}</Menu>}
      >
        <div style={{ width: 300, height: 400 }} ref={containerRef} />
      </Dropdown>
    </div>
  );
}
