import React from 'react';

const Works = () => {
  const works = [
    {
      title: 'Booking Pick & Drop',
      description:
        'From personal packages to business shipments — we deliver on time, every time.',
    },
    {
      title: 'Cash On Delivery',
      description:
        'From personal packages to business shipments — we deliver on time, every time.',
    },
    {
      title: 'Delivery Hub',
      description:
        'From personal packages to business shipments — we deliver on time, every time.',
    },
    {
      title: 'Booking SME & Corporate',
      description:
        'From personal packages to business shipments — we deliver on time, every time.',
    },
  ];

  return (
    <section className=" py-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Section Title */}
        <h2 className="mb-6 text-2xl font-bold text-secondary">How it Works</h2>

        {/* Cards */}
        <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {works.map((work, index) => (
            <div key={index} className="rounded-2xl bg-white p-6">
              {/* Icon */}
              <div className="mb-5 text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="42"
                  height="42"
                  viewBox="0 0 48 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Location Pin */}
                  <path d="M14 21.5C14 15.7 18.5 11 24 11s10 4.7 10 10.5c0 7.5-10 15.5-10 15.5S14 29 14 21.5Z" />

                  <circle cx="24" cy="21" r="3" />

                  {/* Delivery Van */}
                  <path d="M8 31h26v8H8z" />
                  <path d="M34 34h5l4 4v1H34z" />
                  <circle cx="15" cy="40" r="2.5" />
                  <circle cx="37" cy="40" r="2.5" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="mb-3 text-sm font-bold text-secondary">
                {work.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-6 text-secondary/70">
                {work.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Works;
