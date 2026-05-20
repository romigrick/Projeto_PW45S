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
import { CategoryListPage } from '../../pages/category-list';
import { CategoryFormPage } from '../../pages/category-form';
import { ProductListPage } from '../../pages/product-list';
import { ProductFormPage } from '../../pages/product-form';

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
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/categories/new" element={<CategoryFormPage />} />
        <Route path="/categories/:id" element={<CategoryFormPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/addresses" element={<AddressPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        
      </Route>
    </Routes>
  );
};
