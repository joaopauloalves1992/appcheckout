import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data);
      } catch (err) {
        setError('Erro ao carregar produtos. Por favor, tente novamente.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (id) => {
    navigate(`/admin/products/${id}`);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Tem certeza que deseja desativar este produto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Atualiza a lista removendo o produto desativado
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Erro ao desativar produto. Por favor, tente novamente.');
        console.error('Erro:', err);
      }
    }
  };

  const getCheckoutUrl = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/products/${id}/checkout-url`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Copia a URL para a área de transferência
      navigator.clipboard.writeText(window.location.origin + response.data.checkout_url);
      alert('URL do checkout copiada para a área de transferência!');
    } catch (err) {
      setError('Erro ao gerar URL do checkout. Por favor, tente novamente.');
      console.error('Erro:', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Painel de Checkout</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="/admin" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </a>
                <a href="/admin/products" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Produtos
                </a>
                <a href="/admin/orders" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Pedidos
                </a>
                <a href="/admin/bank-accounts" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contas Bancárias
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">Produtos</h1>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Adicionar Produto
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {error && (
              <div className="rounded-md bg-red-50 p-4 my-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div className="px-4 py-8 sm:px-0">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Produto
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Preço
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estoque
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Ações</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.length > 0 ? (
                            products.map((product) => (
                              <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      {product.image_url ? (
                                        <img className="h-10 w-10 rounded-full object-cover" src={product.image_url} alt={product.name} />
                                      ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                          <span className="text-gray-500 text-xs">Sem img</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                      <div className="text-sm text-gray-500">{product.description?.substring(0, 50)}{product.description?.length > 50 ? '...' : ''}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">R$ {product.price.toFixed(2)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.active ? 'Ativo' : 'Inativo'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {product.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => getCheckoutUrl(product.id)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                  >
                                    Copiar URL
                                  </button>
                                  <button
                                    onClick={() => handleEditProduct(product.id)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Desativar
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                Nenhum produto encontrado. Clique em "Adicionar Produto" para criar um novo.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;
