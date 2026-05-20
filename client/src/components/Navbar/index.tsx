import React from 'react';

const Navbar = () => {
  const categories = [
    'Hardware',
    'Periféricos',
    'Computadores',
    'Monitores',
    'Cadeiras Gamer',
    'Games',
    'Celulares',
    'TV'
  ];

  return (
    <nav className="bg-gray-900 py-2 px-8">
      <ul className="flex list-none m-0 p-0 align-items-center justify-content-around">
        {categories.map(category => (
          <li key={category}>
            <a href="#" className="text-white no-underline py-2 px-4 block border-round transition-colors transition-duration-300 hover:bg-gray-700">{category}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
