const userAgent = window.navigator.userAgent.toLowerCase();

export const isMac = userAgent.includes('mac');
export const isWin = userAgent.includes('win');

export const ctrlKeyStr = isMac ? '⌘' : 'Ctrl';
export const shiftKeyStr = isMac ? '⇧' : 'Shift';
export const deleteKeyStr = isMac ? 'Backspace' : 'Delete';

export const isCtrlKey = (e: KeyboardEvent): boolean => (isMac ? e.metaKey : e.ctrlKey);
export const isDeleteKey = (e: KeyboardEvent): boolean => (isMac ? e.code === 'Backspace' : e.code === 'Delete');
export const isInputTag = (el: HTMLElement): boolean => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
