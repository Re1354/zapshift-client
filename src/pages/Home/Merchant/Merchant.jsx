import React from 'react';

const Merchant = () => {
  return (
    <section className="w-full py-6 sm:py-8">
      {/* Main Banner */}
      <div className="relative min-h-[238px] w-full overflow-hidden rounded-3xl bg-secondary px-8 py-9 md:px-12 md:py-12">
          {/* Decorative wave */}
          <div className="pointer-events-none absolute -top-20 left-[15%] h-[150px] w-[55%] -rotate-6 opacity-40">
            <div className="absolute inset-0 rounded-[50%] border-t-[2px] border-primary/30" />
            <div className="absolute left-5 top-2 h-full w-full rounded-[50%] border-t-[2px] border-primary/20" />
            <div className="absolute left-10 top-4 h-full w-full rounded-[50%] border-t-[2px] border-primary/20" />
            <div className="absolute left-16 top-6 h-full w-full rounded-[50%] border-t-[2px] border-primary/20" />
            <div className="absolute left-24 top-8 h-full w-full rounded-[50%] border-t-[2px] border-primary/20" />
            <div className="absolute left-32 top-10 h-full w-full rounded-[50%] border-t-[2px] border-primary/20" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[560px]">
            <h2 className="max-w-[520px] text-2xl font-bold leading-[1.15] text-white md:text-[26px]">
              Merchant and Customer Satisfaction
              <br />
              is Our First Priority
            </h2>

            <p className="mt-4 max-w-[520px] text-xs leading-relaxed text-white/75 sm:text-sm">
              We offer the lowest delivery charge with the highest value along
              with 100% safety of your product. ZapShift delivers your
              parcels in every corner of Bangladesh right on time.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-secondary transition-all duration-200 hover:bg-primary-hover active:scale-95 shadow-sm"
              >
                Become a Merchant
              </button>

              <button
                type="button"
                className="rounded-full border border-primary/80 bg-transparent px-6 py-3 text-xs sm:text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-secondary active:scale-95"
              >
                Earn with ZapShift Courier
              </button>
            </div>
          </div>

          {/* Right-side Package Illustration */}
          <div className="pointer-events-none absolute bottom-3 right-5 hidden h-[205px] w-[390px] md:block">
            {/* Location Pin */}
            <div className="absolute right-[135px] top-0 flex h-12 w-8 items-start justify-center">
              <div className="relative h-10 w-8 rounded-full border-[2px] border-[#2a9aaa]">
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2a9aaa]" />
              </div>
            </div>

            {/* Top Box */}
            <div
              className="
                absolute
                right-[65px]
                top-[43px]
                h-[63px]
                w-[175px]
                rotate-[1deg]
                border
                border-[#2a9aaa]
                bg-secondary
              "
            >
              {/* box top */}
              <div
                className="
                  absolute
                  -top-[16px]
                  left-[7px]
                  h-[20px]
                  w-[170px]
                  -skew-x-[30deg]
                  border
                  border-[#2a9aaa]
                  bg-secondary
                "
              />

              {/* box front line */}
              <div className="absolute left-[88px] top-0 h-full border-l border-[#2a9aaa]" />

              {/* Box label */}
              <div className="absolute bottom-3 right-5 h-5 w-12 border border-[#2a9aaa]" />
            </div>

            {/* Bottom Box */}
            <div
              className="
                absolute
                bottom-[22px]
                right-[105px]
                h-[65px]
                w-[180px]
                rounded-sm
                border
                border-[#2a9aaa]
                bg-secondary
              "
            >
              <div className="absolute right-[-55px] top-[13px] h-[45px] w-[57px] border-b border-r border-[#2a9aaa]" />
            </div>

            {/* Left Box */}
            <div
              className="
                absolute
                bottom-[20px]
                left-[35px]
                h-[55px]
                w-[85px]
                -skew-y-[10deg]
                border
                border-[#2a9aaa]
                bg-secondary
              "
            />

            {/* Delivery route line */}
            <div className="absolute bottom-[28px] left-0 h-12 w-20">
              <svg viewBox="0 0 100 60" className="h-full w-full" fill="none">
                <path
                  d="M2 40 C20 5, 35 60, 55 35 C68 18, 76 35, 98 5"
                  stroke="#2a9aaa"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Right route line */}
            <div className="absolute bottom-[48px] right-0 h-14 w-20">
              <svg viewBox="0 0 100 60" className="h-full w-full" fill="none">
                <path
                  d="M2 48 C20 5, 32 58, 50 30 C65 7, 76 45, 98 2"
                  stroke="#2a9aaa"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Merchant;
