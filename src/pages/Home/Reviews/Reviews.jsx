import React, { use } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import customerTop from '../../../assets/customer-top.png';

import ReviewCard from './ReviewCard';

const Reviews = ({ reviewPromise }) => {
  const reviews = use(reviewPromise);

  return (
    <section className="w-full overflow-hidden py-8 sm:py-12">
      {/* Heading */}
      <div className="mx-auto mb-10 max-w-2xl px-4 text-center">
        <img
          className="mx-auto mb-5 h-24 w-48 object-contain"
          src={customerTop}
          alt=""
        />

        <h2 className="text-3xl font-extrabold text-secondary tracking-tight sm:text-4xl">
          What our customers are saying
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Hear from real customers and merchants who rely on ZapShift for fast, safe, and dependable delivery every day.
        </p>
      </div>

      {/* Reviews Slider */}
      <div className="relative mx-auto w-full">
        <Swiper
          modules={[EffectCoverflow, Navigation, Pagination, Autoplay]}
          effect="coverflow"
          centeredSlides={true}
          slidesPerView={3}
          spaceBetween={20}
          loop={true}
          speed={700}
          grabCursor={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 1,
            scale: 0.82,
            slideShadows: false,
          }}
          navigation={{
            prevEl: '.review-prev',
            nextEl: '.review-next',
          }}
          pagination={{
            el: '.review-pagination',
            clickable: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 15,
            },

            640: {
              slidesPerView: 2,
              spaceBetween: 18,
            },

            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          className="reviews-swiper"
        >
          {reviews.map(review => (
            <SwiperSlide key={review.id} className="!h-auto">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Controls */}
        <div className="mt-7 flex items-center justify-center gap-6">
          {/* Previous */}
          <button
            type="button"
            className="
              review-prev
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-white
              text-xl
              font-extrabold
              text-secondary
              shadow-sm
              transition
              duration-300
              hover:scale-110
            "
            aria-label="Previous review"
          >
            ←
          </button>

          {/* Pagination */}
          <div
            className="
              review-pagination
              !static
              !flex
              !w-auto
              items-center
              justify-center
              gap-1.5
            "
          />

          {/* Next */}
          <button
            type="button"
            className="
              review-next
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-primary
              text-xl
              font-extrabold
              text-secondary
              shadow-sm
              transition
              duration-300
              hover:scale-110
            "
            aria-label="Next review"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
