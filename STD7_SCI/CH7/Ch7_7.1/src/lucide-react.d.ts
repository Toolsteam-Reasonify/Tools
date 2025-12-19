declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export const Flame: FC<IconProps>;
  export const ThermometerSun: FC<IconProps>;
  export const AlertTriangle: FC<IconProps>;
  export const ChevronDown: FC<IconProps>;
  export const ChevronUp: FC<IconProps>;
  export const Beaker: FC<IconProps>;
  export const Info: FC<IconProps>;
  export const RotateCcw: FC<IconProps>;
  export const ChevronRight: FC<IconProps>;
  export const CheckCircle: FC<IconProps>;
  export const XCircle: FC<IconProps>;
  export const Award: FC<IconProps>;
  export const Lightbulb: FC<IconProps>;
  export const Sparkles: FC<IconProps>;
  export const BookOpen: FC<IconProps>;
  export const Zap: FC<IconProps>;
  export const HardHat: FC<IconProps>;
  export const Factory: FC<IconProps>;
  export const Globe: FC<IconProps>;
  export const Utensils: FC<IconProps>;
  export const Shirt: FC<IconProps>;
  export const Building2: FC<IconProps>;
  export const Mountain: FC<IconProps>;
}

