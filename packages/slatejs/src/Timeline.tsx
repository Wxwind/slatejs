import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cutscene } from './core';
import { isNil } from './util';
import TimeMarkIcon from './TimeMarkIcon';
import { TimelineGroupPanel } from './TimelineGroupPanel';
import { useScaleStore } from './store';

export interface TimelineProps {}

export const Timeline: FC<TimelineProps> = (props) => {
  const {} = props;
  const signals = cutscene.signals;

  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const timeCanvasRef = useRef<HTMLCanvasElement>(null);
  const { scale, setScale } = useScaleStore();
  const [prevScale, setPrevScale] = useState(32);
  const [timeMarkLeft, setTimeMarkLeft] = useState('-8px');

  /* FIXME: may not update while cutscene.viewTimeMax update cuz cutscene.viewTimeMax
  is external variable. It's better to draw timeline with canvas. */
  const timelineTrackWidth = useMemo(() => {
    return cutscene.viewTimeMax * scale;
  }, [scale]);

  console.log('timelineTrackWidth', scale, cutscene.viewTimeMax);

  const handleClickTimeCanvas = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      e.preventDefault();

      const onMouseMove = (e: MouseEvent) => {
        if (isNil(scrollerRef.current)) {
          console.error("error: couldn't find scroller");
          return;
        }
        if (e.target === timeCanvasRef.current) {
          cutscene.setTime((e.offsetX + scrollerRef.current.scrollLeft) / scale);
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
    [scale]
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

    ctx.translate(-scroller.scrollLeft, 0);

    const viewTimeMax = cutscene.viewTimeMax;
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
  }, [scale]);

  /* FIXME: may not update cus currentTime is also an external variable */
  const updateTimeMark = useCallback(() => {
    const scroller = scrollerRef.current;
    if (isNil(scroller)) return;
    // 8 = scrollmark.width / 2
    const offsetLeft = cutscene.director.currentTime * scale - scroller.scrollLeft - 8;

    const timeMarkLeft = offsetLeft + 'px';
    setTimeMarkLeft(timeMarkLeft);
  }, [scale]);

  const handleScrollerScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      updateMarks();
      updateTimeMark();
    },
    [updateMarks, updateTimeMark]
  );

  const handleTimelineScaledSignal = useCallback(
    (value: number) => {
      setScale(value);

      const scroller = scrollerRef.current;
      if (isNil(scroller)) return;

      scroller.scrollLeft = (scroller.scrollLeft * value) / prevScale;
      updateMarks();
      updateTimeMark();
      setPrevScale(value);
    },
    [prevScale, setScale, updateMarks, updateTimeMark]
  );

  const handleTimelineScaled = useCallback(
    (e: WheelEvent) => {
      if (e.altKey) {
        e.preventDefault();
        const newScale = Math.max(2, scale + e.deltaY / 10);
        handleTimelineScaledSignal(newScale);
      }
    },
    [handleTimelineScaledSignal, scale]
  );

  useEffect(() => {
    signals.timeChanged.on(updateTimeMark);

    return () => {
      signals.timeChanged.off(updateTimeMark);
    };
  }, [signals.timeChanged, updateTimeMark]);

  useEffect(() => {
    updateMarks();
    window.addEventListener('resize', updateMarks);
    return () => {
      window.removeEventListener('resize', updateMarks);
    };
  }, [updateMarks]);

  useEffect(() => {
    const timelineDOM = timelineRef.current;
    if (isNil(timelineDOM)) return;
    timelineDOM.addEventListener('wheel', handleTimelineScaled);

    return () => {
      timelineDOM.removeEventListener('wheel', handleTimelineScaled);
    };
  }, [handleTimelineScaled]);

  return (
    <div className="timeline" ref={timelineRef}>
      <canvas height={32} className="timeline-time-canvas" ref={timeCanvasRef} onMouseDown={handleClickTimeCanvas} />
      <div className="timeline-scroller" ref={scrollerRef} onScroll={handleScrollerScroll}>
        <div style={{ width: `${timelineTrackWidth}px` }}>
          {cutscene.director.groups.map((a) => {
            return <TimelineGroupPanel key={a.id} width={timelineTrackWidth} object={a} />;
          })}
        </div>
      </div>
      <div className="timeline-timeMark" style={{ left: timeMarkLeft }}>
        <TimeMarkIcon />
      </div>
    </div>
  );
};
