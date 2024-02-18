import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CutsceneEditor } from 'deer-engine';
import { isNil } from '@/util';
import TimeMarkIcon from './TimeMarkIcon';
import { TimelineGroupPanel } from './TimelineGroupPanel';
import { useScaleStore } from './store';
import { useBindSignal, useDumbState } from '@/hooks';

export interface TimelineProps {
  cutsceneEditor: CutsceneEditor;
}

export const Timeline: FC<TimelineProps> = (props) => {
  const { cutsceneEditor } = props;
  const signals = cutsceneEditor.cutscene.signals;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const timeCanvasRef = useRef<HTMLCanvasElement>(null);
  const { scale, setScale } = useScaleStore();
  const [prevScale, setPrevScale] = useState(32);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);
  const [length, setLength] = useState(0);

  const refresh = useDumbState();
  useBindSignal(cutsceneEditor.signals.cutSceneEditorSettingsUpdated, refresh);
  useBindSignal(signals.lengthChanged, (length) => {
    setLength(length);
  });
  useBindSignal(signals.currentTimeUpdated, (currentTime) => {
    setCurrentTime(currentTime);
  });

  const timeMarkLeft = useMemo(() => {
    // 8 = scrollmark.width / 2
    const offsetLeft = currentTime * scale - scrollLeft - 8;
    return offsetLeft;
  }, [currentTime, scale, scrollLeft]);

  const timelineTrackWidth = cutsceneEditor.viewTimeMax * scale;

  const handleClickTimeCanvas = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      e.preventDefault();

      const onMouseMove = (e: MouseEvent) => {
        if (isNil(scrollerRef.current)) {
          console.error("error: couldn't find scroller");
          return;
        }
        if (e.target === timeCanvasRef.current) {
          cutsceneEditor.setTime((e.offsetX + scrollerRef.current.scrollLeft) / scale);
        }
      };

      const onMouseUp = (e: MouseEvent) => {
        onMouseMove(e);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mouseup', onMouseUp, false);
    },
    [cutsceneEditor, scale]
  );

  const updateMarks = useCallback(() => {
    const canvas = timeCanvasRef.current;
    const scroller = scrollerRef.current;
    if (isNil(canvas) || isNil(scroller)) return;
    canvas.width = scroller.clientWidth;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (isNil(ctx)) return;
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#888';
    ctx.beginPath();

    ctx.translate(-scrollLeft, 0);

    const viewTimeMax = cutsceneEditor.viewTimeMax;
    const width = viewTimeMax * scale;
    const scale4 = scale / 4;

    for (let i = 0.5; i <= width; i += scale) {
      ctx.moveTo(i + scale4 * 0, 18);
      ctx.lineTo(i + scale4 * 0, 26);

      if (scale > 16) {
        ctx.moveTo(i + scale4 * 1, 22);
        ctx.lineTo(i + scale4 * 1, 26);
      }
      if (scale > 8) {
        ctx.moveTo(i + scale4 * 2, 22);
        ctx.lineTo(i + scale4 * 2, 26);
      }
      if (scale > 16) {
        ctx.moveTo(i + scale4 * 3, 22);
        ctx.lineTo(i + scale4 * 3, 26);
      }
    }

    ctx.stroke();

    ctx.font = '10px Arial';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';

    const step = Math.max(1, Math.floor(64 / scale));

    for (let i = 0; i < viewTimeMax; i += step) {
      const minute = Math.floor(i / 60);
      const second = Math.floor(i % 60);

      const text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(-2);

      ctx.fillText(text, i * scale, 13);
    }
  }, [cutsceneEditor.viewTimeMax, scale, scrollLeft]);

  const handleScrollerScroll = useCallback((e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scroller = scrollerRef.current;
    if (isNil(scroller)) return;
    setScrollLeft(scroller.scrollLeft);
  }, []);

  const handleTimelineScaled = useCallback(
    (scale: number) => {
      setScale(scale);

      const scroller = scrollerRef.current;
      if (isNil(scroller)) return;

      const scrollerLeft = (scroller.scrollLeft * scale) / prevScale;
      scroller.scrollLeft = scrollerLeft;
      setScrollLeft(scrollerLeft);
      setPrevScale(scale);
    },
    [prevScale, setScale]
  );

  const timelineRef = useRef<HTMLDivElement>(null);

  const handleTimelineWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.altKey) {
        const newScale = Math.max(2, scale + e.deltaY / 10);
        handleTimelineScaled(newScale);
      }
    },
    [handleTimelineScaled, scale]
  );

  useEffect(() => {
    const timelineDOM = timelineRef.current;
    if (isNil(timelineDOM)) return;
    // use addEventListener to use preventDefault()
    timelineDOM.addEventListener('wheel', handleTimelineWheel);

    return () => {
      timelineDOM.removeEventListener('wheel', handleTimelineWheel);
    };
  }, [handleTimelineWheel]);

  useEffect(() => {
    updateMarks();
    window.addEventListener('resize', updateMarks);
    return () => {
      window.removeEventListener('resize', updateMarks);
    };
  }, [updateMarks]);

  useEffect(() => {
    updateMarks();
  }, [updateMarks]);

  return (
    <div className="timeline" ref={timelineRef}>
      <canvas height={32} className="timeline-time-canvas" ref={timeCanvasRef} onMouseDown={handleClickTimeCanvas} />
      <div className="timeline-scroller" ref={scrollerRef} onScroll={handleScrollerScroll}>
        <div style={{ width: `${timelineTrackWidth}px` }}>
          {cutsceneEditor.cutscene.groups.map((a) => {
            return <TimelineGroupPanel key={a.id} width={timelineTrackWidth} object={a} />;
          })}
        </div>
      </div>
      <div className="timeline-timeMark" style={{ left: timeMarkLeft + 'px' }}>
        <TimeMarkIcon />
      </div>
    </div>
  );
};
