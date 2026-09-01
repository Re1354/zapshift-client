import React from 'react';
import Banner from '../Banner/Banner';
import Works from '../Works/Works';
import Services from '../Services/Services';
import Brands from '../Brands/Brands';
import Features from '../Features/Features';
import Merchant from '../Merchant/Merchant';
import Reviews from '../Reviews/Reviews';
import FAQ from '../FAQ/FAQ';

const reviewPromise = fetch('/reviews.json').then(res => res.json());

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Works></Works>
      <Services></Services>
      <Brands></Brands>
      <Features></Features>
      <Merchant></Merchant>
      <Reviews reviewPromise={reviewPromise}></Reviews>
      <FAQ></FAQ>
    </div>
  );
};

export default Home;
