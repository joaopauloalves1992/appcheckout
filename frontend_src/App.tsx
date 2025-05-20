import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProductList from './components/admin/ProductList';
import ProductForm from './components/admin/ProductForm';
import OrderList from './components/admin/OrderList';
import BankAccountList from './components/admin/BankAccountList';
import BankAccountForm from './components/admin/BankAccountForm';
import Checkout from './components/checkout/Checkout';
import CheckoutSuccess from './components/checkout/CheckoutSuccess';
import NotFound from './components/common/NotFound';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Componente para rotas protegidas
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/checkout/:productId" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        
        {/* Rotas de administração */}
        <Route path="/admin/login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/products" element={
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/products/new" element={
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/products/:id" element={
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <OrderList />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/bank-accounts" element={
          <ProtectedRoute>
            <BankAccountList />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/bank-accounts/new" element={
          <ProtectedRoute>
            <BankAccountForm />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/bank-accounts/:id" element={
          <ProtectedRoute>
            <BankAccountForm />
          </ProtectedRoute>
        } />
        
        {/* Rota padrão e 404 */}
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
