import React, { useState } from 'react';
import aboutUsData from './aboutUsData';

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('Story');

  const tabs = Object.keys(aboutUsData);

  return (
    <section className="bg-[#eef0f1] py-5 md:py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Main Card */}
        <div className="rounded-[24px] bg-white px-8 py-12 md:px-12 md:py-14 lg:px-20 lg:py-16">
          {/* Heading */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#004b50] md:text-5xl">
              About Us
            </h1>

            <p className="mt-4 max-w-[520px] text-xs leading-5 text-gray-500 md:text-sm">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </p>
          </div>

          {/* Divider */}
          <div className="my-9 border-t border-gray-200" />

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {tabs.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-lg transition ${
                  activeTab === tab
                    ? 'font-bold text-[#657b2b]'
                    : 'font-medium text-gray-400 hover:text-[#657b2b]'
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
      </div>
    </section>
  );
};

export default AboutUs;
