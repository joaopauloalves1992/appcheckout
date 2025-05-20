import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Checkout = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para o formulário de checkout
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_document: '',
    shipping_address: '',
    shipping_number: '',
    shipping_complement: '',
    shipping_neighborhood: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zipcode: '',
    payment_method: 'pix'
  });
  
  // Estado para controle de etapas
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingCost, setShippingCost] = useState(0);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError('Erro ao carregar produto. Por favor, tente novamente.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const calculateShipping = async () => {
    // Simulação de cálculo de frete baseado no CEP
    if (formData.shipping_zipcode.length === 8) {
      setShippingCost(13.75);
    }
  };
  
  useEffect(() => {
    if (formData.shipping_zipcode.length === 8) {
      calculateShipping();
    }
  }, [formData.shipping_zipcode]);
  
  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        product_id: parseInt(productId),
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        customer_document: formData.customer_document,
        shipping_address: formData.shipping_address,
        shipping_number: formData.shipping_number,
        shipping_complement: formData.shipping_complement,
        shipping_neighborhood: formData.shipping_neighborhood,
        shipping_city: formData.shipping_city,
        shipping_state: formData.shipping_state,
        shipping_zipcode: formData.shipping_zipcode,
        shipping_method: 'PAC',
        shipping_cost: shippingCost,
        payment_method: formData.payment_method
      };
      
      const response = await axios.post(`${API_URL}/orders`, orderData);
      
      // Redirecionar para página de sucesso
      window.location.href = `/checkout/success?order_id=${response.data.order.id}`;
    } catch (err) {
      setError('Erro ao processar pedido. Por favor, verifique os dados e tente novamente.');
      console.error('Erro:', err);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Produto não encontrado.</span>
        </div>
      </div>
    );
  }
  
  // Definir cores personalizadas do checkout
  const headerColor = product.checkout_header_color || '#ffffff';
  const buttonColor = product.checkout_button_color || '#007bff';
  const accentColor = product.checkout_accent_color || '#28a745';
  
  // Definir título e descrição personalizados
  const checkoutTitle = product.checkout_title || product.name;
  const checkoutDescription = product.checkout_description || product.description;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="py-6" style={{ backgroundColor: headerColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {product.image_url && (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="h-16 w-auto"
              />
            )}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-center text-gray-900">
            {checkoutTitle}
          </h1>
          {checkoutDescription && (
            <p className="mt-2 text-center text-gray-600">
              {checkoutDescription}
            </p>
          )}
          {product.checkout_urgency_message && (
            <p className="mt-2 text-center text-sm font-medium" style={{ color: accentColor }}>
              {product.checkout_urgency_message}
            </p>
          )}
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Etapas do checkout */}
          <div className="md:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {currentStep === 1 && 'Dados pessoais e de entrega'}
                    {currentStep === 2 && 'Escolha a forma de envio'}
                    {currentStep === 3 && 'Escolha a forma de pagamento'}
                  </h3>
                  <div className="flex space-x-2">
                    <span className={`h-2 w-2 rounded-full ${currentStep >= 1 ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
                    <span className={`h-2 w-2 rounded-full ${currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
                    <span className={`h-2 w-2 rounded-full ${currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                {/* Etapa 1: Dados pessoais */}
                {currentStep === 1 && (
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6">
                        <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                          Nome completo
                        </label>
                        <input
                          type="text"
                          name="customer_name"
                          id="customer_name"
                          required
                          value={formData.customer_name}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-6">
                        <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700">
                          E-mail
                        </label>
                        <input
                          type="email"
                          name="customer_email"
                          id="customer_email"
                          required
                          value={formData.customer_email}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700">
                          Telefone celular
                        </label>
                        <input
                          type="tel"
                          name="customer_phone"
                          id="customer_phone"
                          required
                          value={formData.customer_phone}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="customer_document" className="block text-sm font-medium text-gray-700">
                          CPF
                        </label>
                        <input
                          type="text"
                          name="customer_document"
                          id="customer_document"
                          required
                          value={formData.customer_document}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        style={{ backgroundColor: buttonColor }}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Próximo
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Etapa 2: Endereço de entrega */}
                {currentStep === 2 && (
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="shipping_zipcode" className="block text-sm font-medium text-gray-700">
                          CEP
                        </label>
                        <input
                          type="text"
                          name="shipping_zipcode"
                          id="shipping_zipcode"
                          required
                          value={formData.shipping_zipcode}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      {shippingCost > 0 && (
                        <div className="col-span-6">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-center">
                              <input
                                id="shipping-option"
                                name="shipping-option"
                                type="radio"
                                checked
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                              />
                              <label htmlFor="shipping-option" className="ml-3 flex flex-col">
                                <span className="block text-sm font-medium text-gray-700">PAC</span>
                                <span className="block text-sm text-gray-500">3 dias* • R$ {shippingCost.toFixed(2)}</span>
                              </label>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">* Dias úteis, após confirmação do pagamento.</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="col-span-6">
                        <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">
                          Endereço
                        </label>
                        <input
                          type="text"
                          name="shipping_address"
                          id="shipping_address"
                          required
                          value={formData.shipping_address}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="shipping_number" className="block text-sm font-medium text-gray-700">
                          Número
                        </label>
                        <input
                          type="text"
                          name="shipping_number"
                          id="shipping_number"
                          required
                          value={formData.shipping_number}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="shipping_complement" className="block text-sm font-medium text-gray-700">
                          Complemento
                        </label>
                        <input
                          type="text"
                          name="shipping_complement"
                          id="shipping_complement"
                          value={formData.shipping_complement}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="shipping_neighborhood" className="block text-sm font-medium text-gray-700">
                          Bairro
                        </label>
                        <input
                          type="text"
                          name="shipping_neighborhood"
                          id="shipping_neighborhood"
                          required
                          value={formData.shipping_neighborhood}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="shipping_city" className="block text-sm font-medium text-gray-700">
                          Cidade
                        </label>
                        <input
                          type="text"
                          name="shipping_city"
                          id="shipping_city"
                          required
                          value={formData.shipping_city}
                          onChange={handleChange}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="shipping_state" className="block text-sm font-medium text-gray-700">
                          Estado
                        </label>
                        <select
                          id="shipping_state"
                          name="shipping_state"
                          required
                          value={formData.shipping_state}
                          onChange={handleChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="">Selecione</option>
                          <option value="SP">São Paulo</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="MG">Minas Gerais</option>
                          {/* Outros estados */}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Voltar
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        style={{ backgroundColor: buttonColor }}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Próximo
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Etapa 3: Forma de pagamento */}
                {currentStep === 3 && (
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-base font-medium text-gray-900">Forma de pagamento</label>
                        <p className="text-sm text-gray-500">Selecione como deseja pagar</p>
                        
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center">
                            <input
                              id="payment_method_pix"
                              name="payment_method"
                              type="radio"
                              value="pix"
                              checked={formData.payment_method === 'pix'}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label htmlFor="payment_method_pix" className="ml-3 block text-sm font-medium text-gray-700">
                              PIX
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="payment_method_boleto"
                              name="payment_method"
                              type="radio"
                              value="boleto"
                              checked={formData.payment_method === 'boleto'}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label htmlFor="payment_method_boleto" className="ml-3 block text-sm font-medium text-gray-700">
                              Boleto Bancário
                            </label>
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="payment_method_credit_card"
                              name="payment_method"
                              type="radio"
                              value="credit_card"
                              checked={formData.payment_method === 'credit_card'}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label htmlFor="payment_method_credit_card" className="ml-3 block text-sm font-medium text-gray-700">
                              Cartão de Crédito
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Detalhes específicos de cada forma de pagamento */}
                      {formData.payment_method === 'pix' && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-700">
                            Ao finalizar a compra, você receberá um QR Code PIX para pagamento imediato.
                          </p>
                        </div>
                      )}
                      
                      {formData.payment_method === 'boleto' && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-700">
                            Ao finalizar a compra, você poderá imprimir o boleto bancário. O prazo de entrega começa a contar após a confirmação do pagamento.
                          </p>
                        </div>
                      )}
                      
                      {formData.payment_method === 'credit_card' && (
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-700">
                            Ao finalizar a compra, você será redirecionado para a página segura de pagamento.
                          </p>
                          <div className="mt-2">
                            <img src="https://via.placeholder.com/200x30?text=Bandeiras+de+Cartões" alt="Bandeiras de cartões aceitas" className="h-6" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Voltar
                      </button>
                      <button
                        type="submit"
                        style={{ backgroundColor: buttonColor }}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Finalizar compra
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {/* Resumo do pedido */}
          <div className="md:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Resumo do pedido</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">Quantidade: 1</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">R$ {product.price.toFixed(2)}</p>
                </div>
                
                {shippingCost > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Frete</p>
                      <p className="text-sm font-medium text-gray-900">R$ {shippingCost.toFixed(2)}</p>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-medium text-gray-900">
                      R$ {(product.price + shippingCost).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                {product.show_stock && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Estoque disponível: <span className="font-medium">{product.stock}</span>
                    </p>
                  </div>
                )}
                
                {product.show_countdown && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium" style={{ color: accentColor }}>
                      Oferta expira em: 23:59:59
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
