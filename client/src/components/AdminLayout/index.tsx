import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from '../AdminNavbar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen surface-ground flex flex-column">
      <AdminNavbar />
      <main className="flex-grow-1 py-4">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
