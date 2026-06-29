import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../../pages/HomePage/index';
import { LoginPage } from '../../pages/LoginPage/index';
import { RegisterPage } from '../../pages/RegisterPage/index';
import ProductListingPage from '../../pages/ProductListingPage/index';
import ProductDetailPage from '../../pages/ProductDetailPage/index';
import CartPage from '../../pages/CartPage/index';
import { RequireAuth } from './require-auth';
import { PublicOnlyRoute } from './public-only-route';
import AccountPage from '../../pages/AccountPage/index';
import AddressPage from '../../pages/AddressPage/index';
import OrdersPage from '../../pages/OrdersPage/index';
import OrderDetailPage from '../../pages/OrderDetailPage/index';
import CheckoutPage from '../../pages/CheckoutPage/index';

import { ProductListPage } from '../../pages/AdminProductListPage';
import { AdminRoute } from './admin-route';
import { AdminLayout } from '../../components/AdminLayout';
import { AdminDashboard } from '../../pages/AdminDashboard';
import { AdminOrdersPage } from '../../pages/AdminOrdersPage';
import { AdminOrderDetailPage } from '../../pages/AdminOrderDetailPage';
import { AdminUsersPage } from '../../pages/AdminUsersPage';
import { AdminProductFormPage } from '../../pages/AdminProductFormPage';
import { AdminCategoryListPage } from '../../pages/AdminCategoryListPage';
import { AdminCategoryFormPage } from '../../pages/AdminCategoryFormPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductListingPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/hardware" element={<ProductListingPage />} />
      <Route path="/cart" element={<CartPage />} />

      <Route element={<RequireAuth />}>

        <Route path="/account" element={<AccountPage />} />
        <Route path="/addresses" element={<AddressPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/products" element={<ProductListPage />} />
          <Route path="/admin/products/new" element={<AdminProductFormPage />} />
          <Route path="/admin/products/:id" element={<AdminProductFormPage />} />
          <Route path="/admin/categories" element={<AdminCategoryListPage />} />
          <Route path="/admin/categories/new" element={<AdminCategoryFormPage />} />
          <Route path="/admin/categories/:id" element={<AdminCategoryFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
