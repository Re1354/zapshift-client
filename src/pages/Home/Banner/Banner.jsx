import React from 'react';
import { useNavigate } from 'react-router';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import bannerImg1 from '../../../assets/banner/banner1.png';
import bannerImg2 from '../../../assets/banner/banner2.png';
import bannerImg3 from '../../../assets/banner/banner3.png';

const Banner = () => {
  const navigate = useNavigate();

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
          bottom-8
          left-6
          sm:bottom-12
          sm:left-10
          md:bottom-16
          md:left-14
          z-20
          flex
          flex-wrap
          items-center
          gap-4
        "
      >
        {/* Track Your Parcel */}
        <button
          onClick={() => navigate('/parcel-track')}
          type="button"
          className="
            flex
            items-center
            gap-3
            rounded-full
            bg-primary
            py-2
            pl-6
            pr-2
            text-sm
            sm:text-base
            font-bold
            text-secondary
            shadow-lg
            transition
            hover:brightness-95
          "
        >
          <span>Track Your Parcel</span>
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#1e232a] text-sm font-bold text-primary">
            ↗
          </span>
        </button>

        {/* Be A Rider */}
        <button
          onClick={() => navigate('/rider')}
          type="button"
          className="
            rounded-full
            bg-white/95
            px-6
            py-3
            text-sm
            sm:text-base
            font-bold
            text-secondary
            shadow-md
            backdrop-blur-sm
            transition
            hover:bg-white
            hover:shadow-lg
          "
        >
          Be A Rider
        </button>
      </div>
    </div>
  );
};

export default Banner;
