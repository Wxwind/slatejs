import { GRAPH_EIDTOR_ID } from '@/constants';

export const setGraphEditorCursorStyle = (cursor: string) => {
  const el = document.getElementById(GRAPH_EIDTOR_ID);
  if (!el) return;
  el.style.cursor = cursor;
};

export const clearGraphEditorCursorStyle = () => {
  const el = document.getElementById(GRAPH_EIDTOR_ID);
  if (!el) return;
  el.style.cursor = 'default';
};
