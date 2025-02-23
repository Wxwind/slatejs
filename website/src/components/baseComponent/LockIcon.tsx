import { FC } from 'react';
import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai';

interface LockIconProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const LockIcon: FC<LockIconProps> = (props) => {
  const { value, onChange } = props;

  return (
    <div
      className="flex items-center"
      onClick={() => {
        onChange(!value);
      }}
    >
      {value ? <AiOutlineLock /> : <AiOutlineUnlock />}
    </div>
  );
};
