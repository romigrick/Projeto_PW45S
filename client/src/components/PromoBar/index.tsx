
import React from 'react';
import CountdownTimer from '../CountdownTimer/index';

const PromoBar = () => {
  return (
    <div className="bg-orange-500 border-round-lg p-4 flex flex-column sm:flex-row align-items-center justify-content-between gap-4">
      <h2 className="text-3xl font-extrabold text-gray-900 m-0">DROP DE OFERTAS</h2>
      <CountdownTimer />
    </div>
  );
}

export default PromoBar;
