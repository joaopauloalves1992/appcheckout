import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  // Definir cores e estilos padrão
  const headerColor = '#ffffff';
  const buttonColor = '#007bff';
  const accentColor = '#28a745';

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="py-6" style={{ backgroundColor: headerColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mt-4 text-3xl font-extrabold text-center text-gray-900">
            Pedido Realizado com Sucesso!
          </h1>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Seu pedido foi recebido!
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Obrigado por sua compra. Seu pedido #{orderId} foi registrado com sucesso.
                  </p>
                </div>
                
                {/* Instruções de pagamento */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-md font-medium text-gray-900">Próximos passos:</h4>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Você receberá um e-mail com as instruções para pagamento e acompanhamento do seu pedido.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Caso tenha escolhido PIX ou boleto, as informações para pagamento também estarão disponíveis no e-mail.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleBackToHome}
                    style={{ backgroundColor: buttonColor }}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Voltar para a página inicial
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
