import React from 'react';

import WhiteLogo from '../../../../Components/WhiteLogo/WhiteLogo';

const Footer = () => {
  return (
    <footer className="w-full">
      <div
        className="
          w-full
          rounded-3xl
          bg-[#0B0B0B]
          px-6
          py-10
          md:px-10
          md:py-14
        "
      >
        {/* Logo + Description */}
        <div className="text-center">
          <div className="flex justify-center">
            <WhiteLogo />
          </div>

          <p className="mx-auto mt-3 max-w-[540px] text-[11px] leading-5 text-white/70 md:text-xs">
            Enjoy fast, reliable parcel delivery with real-time tracking and
            zero hassle. From personal packages to business shipments — we
            deliver on time, every time.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-auto mt-6 w-full max-w-[950px] border-t border-dashed border-secondary/50" />

        {/* Navigation */}
        <nav className="mt-5">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <li>
              <a
                href="#coverage"
                className="text-[11px] text-white/80 transition hover:text-primary"
              >
                Coverage
              </a>
            </li>

            <li>
              <a
                href="#about"
                className="text-[11px] text-white/80 transition hover:text-primary"
              >
                About Us
              </a>
            </li>

            <li>
              <a
                href="#pricing"
                className="text-[11px] text-white/80 transition hover:text-primary"
              >
                Pricing
              </a>
            </li>

            <li>
              <a
                href="#blog"
                className="text-[11px] text-white/80 transition hover:text-primary"
              >
                Blog
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="text-[11px] text-white/80 transition hover:text-primary"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Divider */}
        <div className="mx-auto mt-5 w-full max-w-[950px] border-t border-dashed border-secondary/50" />

        {/* Social Icons */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* LinkedIn */}
          <a
            href="#"
            aria-label="LinkedIn"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1685b5] text-xs font-bold text-white transition hover:scale-110"
          >
            in
          </a>

          {/* X */}
          <a
            href="#"
            aria-label="X"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-black transition hover:scale-110"
          >
            𝕏
          </a>

          {/* Facebook */}
          <a
            href="#"
            aria-label="Facebook"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1688e8] text-sm font-bold text-white transition hover:scale-110"
          >
            f
          </a>

          {/* YouTube */}
          <a
            href="#"
            aria-label="YouTube"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff0000] text-[11px] font-bold text-white transition hover:scale-110"
          >
            ▶
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
