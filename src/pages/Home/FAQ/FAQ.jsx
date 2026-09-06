import React, { useState } from 'react';

const faqs = [
  {
    question: 'How does this posture corrector work?',
    answer:
      'A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here’s how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.',
  },
  {
    question: 'Is it suitable for all ages and body types?',
    answer:
      'Yes, the product is designed to be comfortable for a wide range of ages and body types. Proper adjustment is important for a comfortable fit.',
  },
  {
    question: 'Does it really help with back pain and posture improvement?',
    answer:
      'It can provide support and encourage better posture by helping maintain proper alignment of the shoulders and back during daily activities.',
  },
  {
    question: 'Does it have smart features like vibration alerts?',
    answer:
      'Yes, smart versions can include features such as vibration alerts to remind you when your posture needs correction.',
  },
  {
    question: 'How will I be notified when the product is back in stock?',
    answer:
      'You can subscribe to product notifications and receive an alert when the product becomes available again.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-8 sm:py-10">
      <div className="w-full">
        {/* Heading */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-secondary tracking-tight sm:text-4xl">
            Frequently Asked Question (FAQ)
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Enhance your delivery experience with ZapShift. Fast, reliable, and secure parcel service across the nation.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mx-auto max-w-[785px] space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-[#2a9aaa] bg-[#e9f5f6]'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {/* Question */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left"
                >
                  <span className="text-xs font-semibold text-secondary md:text-sm">
                    {faq.question}
                  </span>

                  {/* Arrow */}
                  <span
                    className={`ml-4 shrink-0 text-lg text-secondary transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ⌄
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="mx-4 border-t border-secondary/10 px-0 py-3">
                      <p className="text-xs leading-5 text-gray-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center justify-center">
          <button
            type="button"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary pl-6 pr-2 py-2 text-sm font-bold text-secondary transition-all duration-200 hover:bg-primary-hover active:scale-95 shadow-sm"
          >
            <span>See More FAQ's</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-base font-bold text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
