import React, { useState } from 'react';
import aboutUsData from './aboutUsData';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('Story');

  const tabs = Object.keys(aboutUsData);

  return (
    <div className="w-full rounded-3xl bg-white p-6 sm:p-10 lg:p-14 shadow-sm">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl md:text-5xl">
          About Us
        </h1>

        <p className="mt-3 max-w-[560px] text-xs leading-6 text-gray-500 sm:text-sm">
          Enjoy fast, reliable parcel delivery with real-time tracking and
          zero hassle. From personal packages to business shipments — we
          deliver on time, every time.
        </p>
      </div>

      {/* Divider */}
      <div className="my-7 sm:my-9 border-t border-gray-100" />

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {tabs.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-xl md:text-2xl transition duration-200 ${
                  activeTab === tab
                    ? 'font-extrabold text-[#5b7527]'
                    : 'font-normal text-gray-400 hover:text-secondary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="mt-9 space-y-5">
            {aboutUsData[activeTab].map((paragraph, index) => (
              <p
                key={index}
                className="text-sm leading-7 text-gray-500 md:text-[15px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
  );
};

export default AboutUs;
