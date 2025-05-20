import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductList from './components/admin/ProductList';
import ProductForm from './components/admin/ProductForm';
import Checkout from './components/checkout/Checkout';
import CheckoutSuccess from './components/checkout/CheckoutSuccess';
import NotFound from './components/common/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas de Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
        <Route path="/admin/products/edit/:id" element={<ProductForm />} />
        
        {/* Rotas de Checkout */}
        <Route path="/checkout/:productId" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        
        {/* Página inicial e 404 */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
