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
    <section className="py-12 md:py-10">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        {/* Heading */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-secondary md:text-4xl">
            Frequently Asked Question (FAQ)
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Enhance posture, mobility, and well-being effortlessly with Posture
            Pro. Achieve proper alignment, reduce pain, and strengthen your body
            with ease!
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
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center">
            <button
              type="button"
              className="
                rounded-xl
                bg-primary
                px-6
                py-3
                text-sm
                font-bold
                text-secondary
                transition
                duration-300
                hover:scale-105
              "
            >
              See More FAQ's
            </button>

            <button
              type="button"
              aria-label="See more FAQs"
              className="
                -ml-.5
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[#202020]
                text-xl
                font-bold
                text-primary
                transition
                duration-300
                hover:scale-105
              "
            >
              ↗
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
