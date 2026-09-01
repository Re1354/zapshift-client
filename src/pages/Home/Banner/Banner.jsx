import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import bannerImg1 from '../../../assets/banner/banner1.png';
import bannerImg2 from '../../../assets/banner/banner2.png';
import bannerImg3 from '../../../assets/banner/banner3.png';

const Banner = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Image Slider */}
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        showArrows={true}
        interval={4000}
        transitionTime={700}
        swipeable
        emulateTouch
      >
        <div>
          <img
            src={bannerImg1}
            alt="Parcel delivery"
            className="h-[600px] w-full object-cover"
          />
        </div>

        <div>
          <img
            src={bannerImg2}
            alt="Fast parcel delivery"
            className="h-[600px] w-full object-cover"
          />
        </div>

        <div>
          <img
            src={bannerImg3}
            alt="Reliable parcel delivery"
            className="h-[600px] w-full object-cover"
          />
        </div>
      </Carousel>

      {/* Fixed Buttons */}
      <div
        className="
          absolute
          bottom-20
          left-10
          z-20
          flex
          items-center
          gap-0
        "
      >
        {/* Track Your Parcel */}
        <button
          className="
            btn
            btn-primary
            h-12
            min-h-12
            rounded-full
            px-8
            text-base
            font-bold
            text-secondary
          "
        >
          Track Your Parcel
        </button>

        {/* Arrow Button */}
        <button
          aria-label="Track your parcel"
          className="
            -ml-1
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-black
            text-xl
            text-primary
            transition
            duration-300
            hover:scale-105
          "
        >
          ↗
        </button>

        {/* Be A Rider */}
        <button
          className="
            ml-6
            py-2
            px-8
            bg-white
            px-2
            text-base
            border-1
            border-zinc-300
            rounded-xl
            font-bold
            text-secondary
            hover:bg-transparent
          "
        >
          Be A Rider
        </button>
      </div>
    </div>
  );
};

export default Banner;
