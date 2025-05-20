# Sistema de Checkout Editável

Um sistema completo de checkout editável para e-commerce, com painel administrativo para personalização e integração com múltiplas formas de pagamento.

## Funcionalidades

- **Painel Administrativo**
  - Gerenciamento de produtos
  - Personalização visual do checkout por produto
  - Configuração de contas bancárias para recebimento
  - Gestão de pedidos

- **Checkout Personalizável**
  - Interface adaptável para cada produto
  - Personalização de cores, textos e imagens
  - Mensagens de urgência configuráveis
  - Exibição opcional de contagem regressiva e estoque

- **Integrações de Pagamento**
  - PIX
  - Boleto bancário
  - Cartão de crédito

## Tecnologias Utilizadas

### Backend
- Flask (Python)
- MySQL
- JWT para autenticação
- Flask-SQLAlchemy para ORM

### Frontend
- React com TypeScript
- Tailwind CSS
- shadcn/ui para componentes

## Estrutura do Projeto

```
projeto/
├── backend/
│   └── checkout_backend/
│       ├── src/
│       │   ├── models/      # Modelos de dados
│       │   ├── routes/      # Rotas da API
│       │   ├── static/      # Arquivos estáticos
│       │   └── main.py      # Ponto de entrada
│       ├── venv/            # Ambiente virtual Python
│       └── requirements.txt # Dependências
└── frontend/
    └── checkout_frontend/
        ├── public/          # Arquivos públicos
        ├── src/             # Código fonte React
        │   ├── components/  # Componentes React
        │   │   ├── admin/   # Componentes do painel admin
        │   │   ├── checkout/# Componentes do checkout
        │   │   └── common/  # Componentes compartilhados
        │   ├── assets/      # Recursos estáticos
        │   └── App.tsx      # Componente principal
        └── package.json     # Dependências
```

## Instalação e Execução

### Backend

1. Navegue até a pasta do backend:
```bash
cd backend/checkout_backend
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute o servidor:
```bash
python -m src.main
```

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend/checkout_frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

## Uso

### Painel Administrativo

1. Acesse `http://localhost:5173/admin/login`
2. Faça login com suas credenciais
3. Cadastre produtos e personalize o checkout
4. Configure suas contas bancárias para recebimento

### Checkout

1. Cada produto terá uma URL única de checkout
2. Compartilhe essa URL com seus clientes
3. Os pagamentos serão processados conforme a configuração

## Manutenção

Este projeto está configurado para ser facilmente mantido e atualizado:

- O backend segue uma estrutura modular com separação clara de responsabilidades
- O frontend utiliza componentes reutilizáveis e tipagem forte com TypeScript
- A documentação detalhada facilita futuras modificações

## Licença

Este projeto é proprietário e confidencial.
