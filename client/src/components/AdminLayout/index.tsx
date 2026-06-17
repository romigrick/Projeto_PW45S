import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: 'pi-home', label: 'Dashboard' },
  { to: '/admin/orders', icon: 'pi-shopping-cart', label: 'Pedidos' },
  { to: '/admin/users', icon: 'pi-users', label: 'Usuários' },
  { to: '/', icon: 'pi-storefront', label: 'Ver Loja' },
];

export const AdminLayout = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    handleLogout();
    navigate('/login');
  };

  const sidebarWidth = collapsed ? '64px' : '200px';

  return (
    <div className="flex min-h-screen surface-ground">
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          backgroundColor: '#003399',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          transition: 'width 0.2s ease, min-width 0.2s ease',
          overflow: 'hidden',
          zIndex: 100,
          boxShadow: '2px 0 8px rgba(0,0,0,0.18)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '1rem 0.75rem 0.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            minHeight: '56px',
          }}
        >
          {!collapsed && (
            <span style={{ color: 'white', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.75)',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              flexShrink: 0,
            }}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <i className={`pi ${collapsed ? 'pi-chevron-right' : 'pi-chevron-left'}`} style={{ fontSize: '0.85rem' }} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin/dashboard'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: collapsed ? '0.65rem 0' : '0.65rem 1rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                borderRadius: '0',
                borderLeft: isActive ? '3px solid #93c5fd' : '3px solid transparent',
                transition: 'background-color 0.15s, color 0.15s',
                whiteSpace: 'nowrap',
              })}
            >
              <i className={`pi ${icon}`} style={{ fontSize: '1rem', flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', padding: '0.75rem' }}>
          <button
            onClick={logout}
            title="Sair"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              width: '100%',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.65)',
              padding: '0.5rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fca5a5')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
          >
            <i className="pi pi-sign-out" style={{ fontSize: '1rem', flexShrink: 0 }} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <main style={{ flex: 1, padding: '1.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
