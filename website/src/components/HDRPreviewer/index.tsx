import * as React from 'react';
import HDRImage from './hdrpng';

export interface HDRPreviewerProps {
  className: string;
  url: string;
}

export const HDRPreviewer: React.FC<HDRPreviewerProps> = (props) => {
  const { className, url } = props;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hdrImageRef = React.useRef(new HDRImage());

  React.useEffect(() => {
    const container = containerRef.current;
    const image = hdrImageRef.current;
    if (!container) return;
    image.src = url;
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      image.style.width = `${width}px`;
      image.style.height = `${height}px`;
    });
    resizeObserver.observe(container);
    containerRef.current.appendChild(image);

    return () => {
      if (container) {
        container.removeChild(hdrImageRef.current);
        resizeObserver.unobserve(container);
      }
    };
  }, [url]);

  return <div className={className} ref={containerRef}></div>;
};
