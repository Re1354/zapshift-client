import React from 'react';
import { Outlet } from 'react-router';

import Navbar from '../pages/Home/Shared/NavBar/Navbar';
import Footer from '../pages/Home/Shared/Footer/Footer';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-[#eef0f1] flex flex-col items-center">
      <div className="w-full max-w-[1340px] px-4 sm:px-6 lg:px-6 xl:px-6 flex flex-col flex-1 gap-6 sm:gap-8 py-4 sm:py-6">
        <Navbar />
        <main className="w-full flex-1 flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;
