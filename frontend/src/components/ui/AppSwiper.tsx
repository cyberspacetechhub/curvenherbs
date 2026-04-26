import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, FreeMode } from 'swiper/modules';
import type { SwiperProps } from 'swiper/react';
import type { ReactNode } from 'react';

interface AppSwiperProps extends Omit<SwiperProps, 'children'> {
  items: ReactNode[];
  showNavigation?: boolean;
  showPagination?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  fadeEffect?: boolean;
  freeMode?: boolean;
  className?: string;
  slideClassName?: string;
}

export default function AppSwiper({
  items,
  showNavigation = false,
  showPagination = true,
  autoplay = false,
  autoplayDelay = 3000,
  fadeEffect = false,
  freeMode = false,
  className = '',
  slideClassName = '',
  ...rest
}: AppSwiperProps) {
  const modules = [
    showNavigation && Navigation,
    showPagination && Pagination,
    autoplay && Autoplay,
    fadeEffect && EffectFade,
    freeMode && FreeMode,
  ].filter(Boolean) as typeof Navigation[];

  return (
    <Swiper
      modules={modules}
      navigation={showNavigation}
      pagination={showPagination ? { clickable: true } : false}
      autoplay={autoplay ? { delay: autoplayDelay, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
      effect={fadeEffect ? 'fade' : undefined}
      freeMode={freeMode}
      className={className}
      {...rest}
    >
      {items.map((item, i) => (
        <SwiperSlide key={i} className={slideClassName}>
          {item}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
