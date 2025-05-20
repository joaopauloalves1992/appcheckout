import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    stock: '0',
    active: true,
    checkout_title: '',
    checkout_description: '',
    checkout_urgency_message: '',
    checkout_header_color: '#ffffff',
    checkout_button_color: '#007bff',
    checkout_accent_color: '#28a745',
    show_countdown: false,
    show_stock: false
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditing) {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${API_URL}/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Converter valores numéricos para string no formulário
          setFormData({
            ...response.data,
            price: response.data.price.toString(),
            stock: response.data.stock.toString()
          });
        } catch (err) {
          setError('Erro ao carregar dados do produto. Por favor, tente novamente.');
          console.error('Erro:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProduct();
  }, [id, isEditing]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Converter strings para números onde necessário
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };
      
      if (isEditing) {
        await axios.put(`${API_URL}/products/${id}`, dataToSend, { headers });
        setSuccess('Produto atualizado com sucesso!');
      } else {
        await axios.post(`${API_URL}/products`, dataToSend, { headers });
        setSuccess('Produto criado com sucesso!');
        // Limpar formulário após criação
        setFormData({
          name: '',
          description: '',
          price: '',
          image_url: '',
          stock: '0',
          active: true,
          checkout_title: '',
          checkout_description: '',
          checkout_urgency_message: '',
          checkout_header_color: '#ffffff',
          checkout_button_color: '#007bff',
          checkout_accent_color: '#28a745',
          show_countdown: false,
          show_stock: false
        });
      }
    } catch (err) {
      setError('Erro ao salvar produto. Por favor, verifique os dados e tente novamente.');
      console.error('Erro:', err);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/products');
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
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="rounded-md bg-green-50 p-4 mb-6">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">{success}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Informações do Produto</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Preencha as informações básicas do produto.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nome do Produto *
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Descrição
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Breve descrição do produto.
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Preço (R$) *
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="price"
                            id="price"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                          Estoque
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="stock"
                            id="stock"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                          URL da Imagem
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="image_url"
                            id="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          URL da imagem do produto.
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <div className="flex items-start mt-6">
                          <div className="flex items-center h-5">
                            <input
                              id="active"
                              name="active"
                              type="checkbox"
                              checked={formData.active}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="active" className="font-medium text-gray-700">
                              Produto Ativo
                            </label>
                            <p className="text-gray-500">Produto disponível para venda.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Personalização do Checkout</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Personalize a aparência do checkout para este produto.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="checkout_title" className="block text-sm font-medium text-gray-700">
                          Título do Checkout
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="checkout_title"
                            id="checkout_title"
                            value={formData.checkout_title}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Se não preenchido, será usado o nome do produto.
                        </p>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="checkout_description" className="block text-sm font-medium text-gray-700">
                          Descrição do Checkout
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="checkout_description"
                            name="checkout_description"
                            rows={3}
                            value={formData.checkout_description}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Se não preenchido, será usada a descrição do produto.
                        </p>
                      </div>

                      <div className="sm:col-span-4">
                        <label htmlFor="checkout_urgency_message" className="block text-sm font-medium text-gray-700">
                          Mensagem de Urgência
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="checkout_urgency_message"
                            id="checkout_urgency_message"
                            value={formData.checkout_urgency_message}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Ex: "Faltam poucas unidades!" ou "Oferta por tempo limitado!"
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="checkout_header_color" className="block text-sm font-medium text-gray-700">
                          Cor do Cabeçalho
                        </label>
                        <div className="mt-1 flex items-center">
                          <input
                            type="color"
                            name="checkout_header_color"
                            id="checkout_header_color"
                            value={formData.checkout_header_color}
                            onChange={handleChange}
                            className="h-8 w-8 mr-2"
                          />
                          <input
                            type="text"
                            value={formData.checkout_header_color}
                            onChange={handleChange}
                            name="checkout_header_color"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="checkout_button_color" className="block text-sm font-medium text-gray-700">
                          Cor dos Botões
                        </label>
                        <div className="mt-1 flex items-center">
                          <input
                            type="color"
                            name="checkout_button_color"
                            id="checkout_button_color"
                            value={formData.checkout_button_color}
                            onChange={handleChange}
                            className="h-8 w-8 mr-2"
                          />
                          <input
                            type="text"
                            value={formData.checkout_button_color}
                            onChange={handleChange}
                            name="checkout_button_color"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="checkout_accent_color" className="block text-sm font-medium text-gray-700">
                          Cor de Destaque
                        </label>
                        <div className="mt-1 flex items-center">
                          <input
                            type="color"
                            name="checkout_accent_color"
                            id="checkout_accent_color"
                            value={formData.checkout_accent_color}
                            onChange={handleChange}
                            className="h-8 w-8 mr-2"
                          />
                          <input
                            type="text"
                            value={formData.checkout_accent_color}
                            onChange={handleChange}
                            name="checkout_accent_color"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="show_countdown"
                              name="show_countdown"
                              type="checkbox"
                              checked={formData.show_countdown}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="show_countdown" className="font-medium text-gray-700">
                              Exibir Contagem Regressiva
                            </label>
                            <p className="text-gray-500">Mostra um contador regressivo para criar urgência.</p>
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="show_stock"
                              name="show_stock"
                              type="checkbox"
                              checked={formData.show_stock}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="show_stock" className="font-medium text-gray-700">
                              Exibir Quantidade em Estoque
                            </label>
                            <p className="text-gray-500">Mostra a quantidade disponível no checkout.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductForm;
