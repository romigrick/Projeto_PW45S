import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppRoutes } from './routes/app-routes';
import './App.css';
import { NotificationProvider } from './context/NotificationContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <ScrollToTop />
              <AppRoutes />
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
