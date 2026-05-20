import React from 'react';

import Header from '../../components/Header/index';
import Hero from '../../components/Hero/index';
import PromoBar from '../../components/PromoBar/index';
import ProductCarousel from '../../components/ProductCarousel/index';
import NinjaHighlights from '../../components/NinjaHighlights/index';
import RecommendedBrands from '../../components/RecommendedBrands/index';
import RelatedLinks from '../../components/RelatedLinks/index';
import Newsletter from '../../components/Newsletter/index';
import Footer from '../../components/Footer/index';

const HomePage = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <Hero />
        <PromoBar />
        <ProductCarousel />
        <NinjaHighlights />
        <RecommendedBrands />
        <RelatedLinks />
      </main>
      <Newsletter />
      <Footer />
    </>
  );
}

export default HomePage;
