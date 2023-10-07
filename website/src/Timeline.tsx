import React, { useEffect, useRef, useState } from 'react';
import { Timeline, TimelineModel } from 'animation-timeline-js';

type Props = {
  time: number;
  model: TimelineModel;
};

function TimelineComponent(props: Props) {
  const { model, time } = props;
  const timelineElRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<Timeline>();

  useEffect(() => {
    let newTimeline: Timeline | null = null;
    // On component init
    if (timelineElRef.current) {
      newTimeline = new Timeline({ id: timelineElRef.current });
      // Here you can subscribe on timeline component events
      setTimeline(newTimeline);
    }

    // cleanup on component unmounted.
    return () => {
      timeline?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    if (timeline) {
      timeline.setModel(model);
    }
  }, [model, timeline]);

  // Example to subscribe and pass model or time update:
  useEffect(() => {
    if (timeline) {
      timeline.setTime(time);
    }
  }, [time, timeline]);

  return <div ref={timelineElRef} />;
}
export default TimelineComponent;
