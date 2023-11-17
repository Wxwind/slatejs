const { userAgent } = window.navigator;

export const isMac = userAgent.includes('Mac');
export const isWin = userAgent.includes('Windows');

export const CTRL_KEY = isMac ? '⌘' : 'Ctrl';
export const SHIFT_KEY = isMac ? '⇧' : 'Shift';
export const DELETE_KEY = isMac ? 'Backspace' : 'Delete';

export const isCtrlKey = (e: KeyboardEvent): boolean => (isMac ? e.metaKey : e.ctrlKey);
export const isInputTag = (el: HTMLElement): boolean => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
