import React from 'react';
import { Link } from 'react-router-dom';
import banner1 from '../../assets/1738948323.jpg';
import banner2 from '../../assets/1718990187.jpg';

const Hero = () => {
  return (
    <section className="my-4 flex flex-column md:flex-row gap-4">
      {/* Banner % OFF */}
      <Link to={`/products?category=${encodeURIComponent('Monitores')}`} className="w-full md:w-3">
        <img
          src={banner1}
          alt="Banner de Ofertas % OFF"
          className="border-round-lg w-full h-full"
          style={{objectFit: 'cover'}}
        />
      </Link>
      
      {/* Banner Festival de Cupons */}
      <div className="w-full md:w-9 relative">
        <img
          src={banner2}
          alt="Banner Festival de Cupons"
          className="border-round-lg w-full h-full"
          style={{objectFit: 'cover'}}
        />
        <div 
          className="absolute bg-yellow-400 text-white py-1 px-3 border-circle text-sm font-bold flex align-items-center"
          style={{top: '1rem', left: '1rem'}}
        >
          <i className="pi pi-mobile mr-1 text-white"></i>
          Exclusivo no APP
        </div>
      </div>
    </section>
  );
}

export default Hero;
