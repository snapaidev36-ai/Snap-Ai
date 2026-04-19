import type { CSSProperties } from 'react';

type BackgroundPatternProps = {
  src?: string;
  className?: string;
  opacity?: number;
  position?: CSSProperties['backgroundPosition'];
  repeat?: CSSProperties['backgroundRepeat'];
  size?: CSSProperties['backgroundSize'];
};

export function BackgroundPattern({
  src = '/bg-pattern.png',
  className,
  opacity = 1,
  position = 'center',
  repeat = 'repeat',
  size = 'auto',
}: BackgroundPatternProps) {
  return (
    <div
      aria-hidden='true'
      className={className ?? 'pointer-events-none absolute inset-0'}
      style={{
        backgroundImage: `url('${src}')`,
        backgroundPosition: position,
        backgroundRepeat: repeat,
        backgroundSize: size,
        opacity,
      }}
    />
  );
}
