import { Shape } from '@/types';

export interface BaseStyleProps {
  zIndex?: number;
  visible?: boolean;
}

export interface DisplayObjectConfig<StyleProps extends BaseStyleProps = BaseStyleProps> {
  id?: string;
  name?: string;
  type?: Shape;
  style?: StyleProps;
}
