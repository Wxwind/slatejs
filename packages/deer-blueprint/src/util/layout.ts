export const DEFAULT_NODD_WIDTH = 150;
export const PIN_HEIGHT = 24;
export const NODE_TITLE_HEIGHT = 32;

export const getNodeHeight = (pinNum: number) => {
  return NODE_TITLE_HEIGHT + 16 + pinNum * PIN_HEIGHT + 2;
};
