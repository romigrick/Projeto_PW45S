import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="py-3 px-5 text-white flex justify-content-between align-items-center"
      style={{
        backgroundColor: '#003399',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="flex align-items-center gap-5">
        <h2 className="m-0 text-xl font-bold text-white">Admin Panel</h2>
        <div className="flex gap-4">
          {[
            { to: '/admin/dashboard', label: 'Dashboard' },
            { to: '/admin/orders', label: 'Pedidos' },
            { to: '/admin/users', label: 'Usuários' },
            { to: '/', label: 'Ir para Loja' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="no-underline font-semibold text-sm"
              style={{ color: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#93c5fd')}
              onMouseLeave={e => (e.currentTarget.style.color = 'white')}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="border-none cursor-pointer font-semibold text-sm px-3 py-2 border-round"
        style={{ backgroundColor: 'transparent', color: 'white' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fca5a5')}
        onMouseLeave={e => (e.currentTarget.style.color = 'white')}
      >
        Sair
      </button>
    </nav>
  );
};
