import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

import casio from '../../../assets/brands/casio.png';
import amazon from '../../../assets/brands/amazon.png';
import moonstar from '../../../assets/brands/moonstar.png';
import star from '../../../assets/brands/star.png';
import start_people from '../../../assets/brands/start_people.png';
import randstad from '../../../assets/brands/randstad.png';

const brandLogos = [
  {
    name: 'Casio',
    image: casio,
  },
  {
    name: 'Amazon',
    image: amazon,
  },
  {
    name: 'Moonstar',
    image: moonstar,
  },
  {
    name: 'Star+',
    image: star,
  },
  {
    name: 'Start People',
    image: start_people,
  },
  {
    name: 'Randstad',
    image: randstad,
  },
];

const Brands = () => {
  return (
    <section className="w-full py-8 sm:py-10">
      <div className="w-full">
        {/* Heading */}
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold leading-tight text-secondary tracking-tight">
          We've helped thousands of sales teams
        </h2>

        {/* Sliding Logos */}
        <div className="mt-8">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            slidesPerView={2}
            spaceBetween={30}
            speed={3000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            allowTouchMove={true}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 35,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 45,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 35,
              },
            }}
          >
            {brandLogos.map(brand => (
              <SwiperSlide key={brand.name}>
                <div className="flex h-[55px] items-center justify-center">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-h-[32px] max-w-[140px] object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Dashed Divider */}
        <div className="mt-14 border-b border-dashed border-secondary/20" />
      </div>
    </section>
  );
};

export default Brands;
