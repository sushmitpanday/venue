import React from 'react';
import FeaturedVenue from './components/FeaturedVenue';
import HeroSection from './components/HeroSection';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  return (
    <>
      <FeaturedVenue/>
      <HeroSection />
      <Footer />
    </>
  );  
};

export default Home;