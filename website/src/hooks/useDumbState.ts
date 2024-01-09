import { useCallback, useState } from 'react';

export const useDumbState = () => {
  const [, setDumbNum] = useState(0);
  const refresh = useCallback(() => {
    setDumbNum((a) => a + 1);
  }, []);

  return refresh;
};
