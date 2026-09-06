import React from 'react';
import serviceIcon from '../../../assets/service.png';

const Services = () => {
  const services = [
    {
      title: 'Express & Standard Delivery',
      description:
        'We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.',
    },
    {
      title: 'Nationwide Delivery',
      description:
        'We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.',
      featured: true,
    },
    {
      title: 'Fulfillment Solution',
      description:
        'We also offer customized service with inventory management support, online order processing, packaging, and after sales support.',
    },
    {
      title: 'Cash on Home Delivery',
      description:
        '100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.',
    },
    {
      title: 'Corporate Service / Contract In Logistics',
      description:
        'Customized corporate services which includes warehouse and inventory management support.',
    },
    {
      title: 'Parcel Return',
      description:
        'Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.',
    },
  ];

  return (
    <section className="w-full py-6 sm:py-8">
      {/* Main Services Box */}
      <div className="w-full rounded-3xl bg-secondary px-6 py-10 sm:px-10 md:px-12 lg:px-16">
          {/* Heading */}
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Our Services
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-white/75 md:text-sm">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex h-[280px]  flex-col items-center justify-center rounded-[20px] px-7 py-8 text-center ${
                  service.featured
                    ? 'bg-primary text-secondary'
                    : 'bg-white text-secondary'
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`mb-5 flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full ${
                    service.featured ? 'bg-white/60' : 'bg-[#f1f1ff]'
                  }`}
                >
                  <img src={serviceIcon} alt="" />
                </div>

                {/* Title */}
                <h3 className="max-w-[280px] text-[18px] font-bold leading-[1.3] md:text-[19px]">
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className={`mt-4 max-w-[290px] text-[13px] leading-6 ${
                    service.featured ? 'text-secondary/75' : 'text-secondary/70'
                  }`}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
};

export default Services;
