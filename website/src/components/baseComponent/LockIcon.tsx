import { FC } from 'react';
import { LuLock, LuUnlock } from 'react-icons/lu';

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
      {value ? <LuLock /> : <LuUnlock />}
    </div>
  );
};
