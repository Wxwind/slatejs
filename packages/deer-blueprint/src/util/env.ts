const { userAgent } = window.navigator;

export const isMac = userAgent.includes('Mac');
export const isWin = userAgent.includes('Windows');

export const ctrlKeyStr = isMac ? '⌘' : 'Ctrl';
export const shiftKeyStr = isMac ? '⇧' : 'Shift';
export const deleteKeyStr = isMac ? 'Backspace' : 'Delete';

/** used when key is down/pressed/up */
export const isCtrlKey = (e: KeyboardEvent): boolean => (isMac ? e.key === 'Meta' : e.key === 'Ctrl');
export const isDeleteKey = (e: KeyboardEvent): boolean => (isMac ? e.key === 'Backspace' : e.key === 'Delete');

export const isCtrlKeyHold = (e: KeyboardEvent | MouseEvent | TouchEvent): boolean => (isMac ? e.metaKey : e.ctrlKey);
export const isAltKeyHold = (e: KeyboardEvent | MouseEvent | TouchEvent): boolean => e.altKey;
export const isShiftKeyHold = (e: KeyboardEvent | MouseEvent | TouchEvent): boolean => e.shiftKey;

export const isInputTag = (el: HTMLElement): boolean => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
