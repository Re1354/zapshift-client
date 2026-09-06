import React from 'react';

import trackingImg from '../../../assets/live-tracking.png';
import safeDeliveryImg from '../../../assets/safe-delivery.png';
import supportImg from '../../../assets/safe-delivery.png';

const features = [
  {
    title: 'Live Parcel Tracking',
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: trackingImg,
  },
  {
    title: '100% Safe Delivery',
    description:
      'We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.',
    image: safeDeliveryImg,
  },
  {
    title: '24/7 Call Center Support',
    description:
      'Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.',
    image: supportImg,
  },
];

const Features = () => {
  return (
    <section className="w-full py-6 sm:py-8">
      <div className="w-full">
        {/* Feature Cards */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex min-h-[142px] items-center rounded-2xl bg-white px-5 py-5 md:px-8 md:py-6"
            >
              {/* Illustration */}
              <div className="flex w-[150px] shrink-0 items-center justify-center md:w-[160px]">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-[115px] w-[125px] object-contain"
                />
              </div>

              {/* Dotted Divider */}
              <div className="mx-5 h-[82px] border-l border-dashed border-secondary/40 md:mx-7" />

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-base font-bold text-secondary md:text-lg">
                  {feature.title}
                </h3>

                <p className="mt-2 max-w-[720px] text-[11px] leading-5 text-secondary/70 md:text-xs md:leading-6">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Dashed Line */}
        <div className="mt-14 border-t border-dashed border-secondary/20" />
      </div>
    </section>
  );
};

export default Features;
