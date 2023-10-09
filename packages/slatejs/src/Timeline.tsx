import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CutScene } from './core';
import { isNil } from './utils';
import TimeMarkIcon from './TimeMarkIcon';
import TimelineTracks from './TimelineTracks';

export interface TimelineProps {
  cutScene: CutScene;
}

const Timeline: FC<TimelineProps> = (props) => {
  const { cutScene } = props;
  const signals = cutScene.signals;
  const player = cutScene.player;

  const timelineRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const timeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(32); // scale == pixels per seconds
  const [prevScale, setPrevScale] = useState(32);
  const [timeMarkLeft, setTimeMarkLeft] = useState('-8px');

  const timelineTrackWidth = useMemo(() => {
    return cutScene.duration * scale;
  }, [cutScene.duration, scale]);

  const handleTimelineScaled = useCallback(
    (e: WheelEvent) => {
      if (e.altKey) {
        e.preventDefault();
        const newScale = Math.max(2, scale + e.deltaY / 10);
        signals.timelineScaled.emit(newScale);
      }
    },
    [scale, signals.timelineScaled]
  );

  const handleClickTimeCanvas = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
      e.preventDefault();

      const onMouseMove = (e: MouseEvent) => {
        if (isNil(scrollerRef.current)) {
          console.error("error: couldn't find scroller");
          return;
        }
        if (e.target === timeCanvasRef.current) {
          cutScene.setTime((e.offsetX + scrollerRef.current.scrollLeft) / scale);
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
    [cutScene, scale]
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

    const duration = cutScene.duration;
    const width = duration * scale;
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

    for (let i = 0; i < duration; i += step) {
      const minute = Math.floor(i / 60);
      const second = Math.floor(i % 60);

      const text = (minute > 0 ? minute + ':' : '') + ('0' + second).slice(-2);

      ctx.fillText(text, i * scale, 13);
    }
  }, [cutScene.duration, scale]);

  const updateTimeMark = useCallback(() => {
    const scroller = scrollerRef.current;
    if (isNil(scroller)) return;
    // 8 = scrollmark.width / 2
    const offsetLeft = player.currentTime * scale - scroller.scrollLeft - 8;

    const timeMarkLeft = offsetLeft + 'px';
    setTimeMarkLeft(timeMarkLeft);
  }, [player.currentTime, scale]);

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
    [prevScale, updateMarks, updateTimeMark]
  );

  useEffect(() => {
    signals.windowResized.on(updateMarks);
    signals.timeChanged.on(updateTimeMark);
    signals.timelineScaled.on(handleTimelineScaledSignal);

    return () => {
      signals.windowResized.off(updateMarks);
      signals.timeChanged.off(updateTimeMark);
      signals.timelineScaled.off(handleTimelineScaledSignal);
    };
  }, [
    signals.timeChanged,
    signals.timelineScaled,
    signals.windowResized,
    handleTimelineScaledSignal,
    updateMarks,
    updateTimeMark,
  ]);

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
        <TimelineTracks width={timelineTrackWidth} />
      </div>
      <div className="timeline-timeMark" style={{ left: timeMarkLeft }}>
        <TimeMarkIcon />
      </div>
    </div>
  );
};

export default Timeline;
