import { CTRL_KEY, DELETE_KEY, SHIFT_KEY } from '@/util';

export function transformKeymap(key: string): React.ReactNode {
  const elems = key.split(' ');
  const elemsNodes = elems.map((el) => {
    const reg = /^'(.*)'$/.exec(el);
    if (reg !== null) {
      return (
        <div className="px-1 h-5 flex items-center justify-center">
          <span className="leading-5">{reg[1]}</span>
        </div>
      );
    }

    const lowerEl = el.toLocaleLowerCase();
    let a = el;

    if (lowerEl === 'ctrl' || lowerEl === 'command') {
      a = CTRL_KEY;
    }
    if (lowerEl === 'shift') {
      a = SHIFT_KEY;
    }
    if (lowerEl === 'delete' || lowerEl === 'backspace') {
      a = DELETE_KEY;
    }

    return (
      <div className="px-1 rounded-sm h-5 flex items-center justify-center min-w-[20px]">
        <span className="leading-5">{a}</span>
      </div>
    );
  });
  return <div className="flex">{elemsNodes}</div>;
}
