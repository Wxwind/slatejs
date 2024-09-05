import { Tooltip } from '@arco-design/web-react';
import { ReactNode } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';

interface ImmerFormItemProps {
  label?: ReactNode;
  children?: ReactNode;
  tooltip?: ReactNode;
  nodeAfter?: ReactNode;
}

export function ImmerFormItem(props: ImmerFormItemProps) {
  const { label, children, tooltip, nodeAfter } = props;

  return (
    <div className="py-1 flex">
      <div className="h-7 flex-1 overflow-ellipsis flex items-center justify-between w-1/4">
        <div className="flex items-center">
          <div className="truncate">{label}</div>
          {tooltip && (
            <Tooltip content={tooltip}>
              <BsQuestionCircle className="ml-1 text-content3" size={12} />
            </Tooltip>
          )}
        </div>
        {nodeAfter}
      </div>

      <div className="w-3/4 pl-2">{children}</div>
    </div>
  );
}
