import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminNavbar } from '../AdminNavbar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-column">
      <AdminNavbar />
      <main className="flex-grow-1 p-4 surface-ground">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
