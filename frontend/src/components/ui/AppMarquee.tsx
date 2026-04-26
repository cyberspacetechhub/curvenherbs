import MarqueeLib from 'react-fast-marquee';
import type { ReactNode } from 'react';

// Handle CJS/ESM interop
const Marquee = (MarqueeLib as any).default ?? MarqueeLib;

interface AppMarqueeProps {
  items: ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gradient?: boolean;
  gradientColor?: string;
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
}

export default function AppMarquee({
  items,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  gradient = true,
  gradientColor = '#F5F0E8',
  className = '',
  itemClassName = '',
  separator,
}: AppMarqueeProps) {
  return (
    <Marquee
      speed={speed}
      direction={direction}
      pauseOnHover={pauseOnHover}
      gradient={gradient}
      gradientColor={gradientColor}
      className={className}
    >
      {items.map((item, i) => (
        <span key={i} className={`inline-flex items-center ${itemClassName}`}>
          {item}
          {separator && i < items.length - 1 && (
            <span className="mx-4">{separator}</span>
          )}
        </span>
      ))}
    </Marquee>
  );
}
