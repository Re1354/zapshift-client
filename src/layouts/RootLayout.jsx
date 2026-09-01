import React from 'react';
import { Outlet } from 'react-router';

import Navbar from '../pages/Home/Shared/NavBar/Navbar';
import Footer from '../pages/Home/Shared/Footer/Footer';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-[#eef0f1] max-w-7xl mx-auto">
      <Navbar />
      <Outlet />  
      <Footer />
    </div>
  );
};

export default RootLayout;
