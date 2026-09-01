import React from 'react';
import { Outlet } from 'react-router';

import Logo from '../Components/Logo/Logo';
import authImage from '../assets/authImage.png';

const AuthLayout = () => {
  return (
    <div className="fixed inset-0 h-dvh w-full overflow-hidden bg-white">
      <div className="flex h-full w-full">
        {/* Left Side */}
        <div className="relative flex h-full w-full bg-white lg:w-1/2">
          {/* Logo */}
          <div className="absolute left-5 top-4 z-10 md:left-7 md:top-5">
            <div className="scale-[0.85] origin-top-left">
              <Logo />
            </div>
          </div>

          {/* Form */}
          <main className="flex h-full w-full items-center justify-center px-6 lg:px-12">
            <div className="w-full max-w-[360px]">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Right Side */}
        <div className="hidden h-full w-1/2 items-center justify-center bg-[#f8fceb] lg:flex">
          <img
            src={authImage}
            alt="Parcel delivery illustration"
            className="w-[60%] max-w-[400px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
