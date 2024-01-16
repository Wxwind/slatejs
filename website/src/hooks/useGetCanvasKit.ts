import CanvasKitInit, { CanvasKit } from 'canvaskit-wasm';
import { useEffect, useState } from 'react';

export const useGetCanvasKit = () => {
  const [canvasKit, setCanvasKit] = useState<CanvasKit>();
  useEffect(() => {
    const init = async () => {
      const ck = await CanvasKitInit({
        locateFile: (file) => {
          console.log('file', file);
          return 'https://libs.cdnjs.net/canvaskit-wasm/0.39.1/' + file;
        },
      });
      setCanvasKit(ck);
      return ck;
    };

    init();
  }, []);

  return canvasKit;
};
