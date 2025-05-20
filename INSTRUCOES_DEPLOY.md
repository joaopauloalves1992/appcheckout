# Instruções para Deploy do Sistema de Checkout Editável

Este documento contém instruções detalhadas para configurar, executar e fazer o deploy do sistema de checkout editável.

## 1. Estrutura do Projeto

O arquivo ZIP contém a seguinte estrutura:

```
checkout_system.zip/
├── README.md                 # Documentação principal do projeto
├── funcionalidades_e_fluxo.md # Detalhamento das funcionalidades
├── requisitos.md             # Requisitos do sistema
├── stack_tecnologica.md      # Stack tecnológica utilizada
├── todo.md                   # Lista de tarefas do desenvolvimento
├── requirements.txt          # Dependências do backend
├── package.json              # Dependências do frontend
├── backend_src/              # Código fonte do backend Flask
├── frontend_src/             # Código fonte do frontend React
└── frontend_public/          # Arquivos públicos do frontend
```

## 2. Configuração do Repositório GitHub

1. Crie um novo repositório no GitHub:
   - Acesse https://github.com/new
   - Dê um nome ao repositório (ex: "checkout-editavel")
   - Escolha a visibilidade (público ou privado)
   - Clique em "Create repository"

2. Clone o repositório vazio:
   ```bash
   git clone https://github.com/SEU_USUARIO/checkout-editavel.git
   cd checkout-editavel
   ```

3. Extraia o conteúdo do arquivo ZIP para o repositório:
   - Descompacte o arquivo `checkout_system.zip`
   - Copie todo o conteúdo para a pasta do repositório

4. Reorganize a estrutura para o padrão original:
   ```bash
   mkdir -p backend/checkout_backend/src
   mkdir -p frontend/checkout_frontend/src
   mkdir -p frontend/checkout_frontend/public
   
   # Mova os arquivos para as pastas corretas
   cp -r backend_src/* backend/checkout_backend/src/
   cp -r frontend_src/* frontend/checkout_frontend/src/
   cp -r frontend_public/* frontend/checkout_frontend/public/
   cp requirements.txt backend/checkout_backend/
   cp package.json frontend/checkout_frontend/
   
   # Remova as pastas temporárias
   rm -rf backend_src frontend_src frontend_public
   ```

5. Faça o commit e push para o GitHub:
   ```bash
   git add .
   git commit -m "Versão inicial do sistema de checkout editável"
   git push origin main
   ```

## 3. Deploy do Backend na Vercel

1. Crie um arquivo `vercel.json` na raiz do diretório backend:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/main.py"
       }
     ]
   }
   ```

2. Crie um arquivo `requirements.txt` na raiz do diretório backend (se ainda não existir):
   ```
   flask==3.1.0
   flask-sqlalchemy==3.1.1
   flask-cors==6.0.0
   pymysql==1.1.1
   pyjwt==2.10.1
   ```

3. Faça login na Vercel:
   - Acesse https://vercel.com/
   - Faça login com sua conta GitHub
   - Clique em "Add New" > "Project"
   - Selecione o repositório "checkout-editavel"
   - Configure o projeto:
     - Root Directory: `backend/checkout_backend`
     - Framework Preset: "Other"
   - Clique em "Deploy"

## 4. Deploy do Frontend na Vercel

1. Crie um arquivo `vercel.json` na raiz do diretório frontend:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. Atualize o arquivo `package.json` para incluir as dependências necessárias:
   ```json
   {
     "name": "checkout-frontend",
     "private": true,
     "version": "0.1.0",
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
       "preview": "vite preview"
     },
     "dependencies": {
       "axios": "^1.6.7",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "react-router-dom": "^6.22.1",
       "tailwindcss": "^3.4.1",
       "class-variance-authority": "^0.7.0",
       "clsx": "^2.1.0",
       "lucide-react": "^0.323.0",
       "tailwind-merge": "^2.2.1"
     },
     "devDependencies": {
       "@types/node": "^20.11.19",
       "@types/react": "^18.2.55",
       "@types/react-dom": "^18.2.19",
       "@typescript-eslint/eslint-plugin": "^6.21.0",
       "@typescript-eslint/parser": "^6.21.0",
       "@vitejs/plugin-react": "^4.2.1",
       "autoprefixer": "^10.4.17",
       "eslint": "^8.56.0",
       "eslint-plugin-react-hooks": "^4.6.0",
       "eslint-plugin-react-refresh": "^0.4.5",
       "postcss": "^8.4.35",
       "typescript": "^5.2.2",
       "vite": "^5.1.0"
     }
   }
   ```

3. Crie um novo projeto na Vercel:
   - Acesse https://vercel.com/
   - Clique em "Add New" > "Project"
   - Selecione o mesmo repositório "checkout-editavel"
   - Configure o projeto:
     - Root Directory: `frontend/checkout_frontend`
     - Framework Preset: "Vite"
   - Adicione variáveis de ambiente:
     - `VITE_API_URL`: URL do backend (ex: https://seu-backend.vercel.app/api)
   - Clique em "Deploy"

## 5. Configuração do Banco de Dados

Para ambiente de produção, recomendamos usar o PlanetScale (MySQL):

1. Crie uma conta no PlanetScale: https://planetscale.com/
2. Crie um novo banco de dados
3. Obtenha as credenciais de conexão
4. Adicione as variáveis de ambiente no projeto backend na Vercel:
   - `DB_USERNAME`: Usuário do banco de dados
   - `DB_PASSWORD`: Senha do banco de dados
   - `DB_HOST`: Host do banco de dados
   - `DB_PORT`: Porta do banco de dados
   - `DB_NAME`: Nome do banco de dados

## 6. Uso do Sistema

### Painel Administrativo

1. Acesse o painel administrativo: `https://seu-frontend.vercel.app/admin`
2. Crie um usuário administrador:
   - Use a API diretamente: `POST /api/users/register` com os campos:
     ```json
     {
       "name": "Admin",
       "email": "admin@example.com",
       "password": "senha123",
       "is_admin": true
     }
     ```
3. Faça login com as credenciais criadas
4. Cadastre produtos e personalize o checkout
5. Configure suas contas bancárias para recebimento

### Checkout

1. No painel administrativo, acesse a lista de produtos
2. Clique em "Copiar URL" para obter o link do checkout de um produto
3. Compartilhe essa URL com seus clientes
4. Os pagamentos serão processados conforme a configuração

## 7. Manutenção e Atualizações

Para manter e atualizar o sistema:

1. Clone o repositório localmente
2. Faça as alterações necessárias
3. Teste localmente:
   - Backend: `cd backend/checkout_backend && python -m src.main`
   - Frontend: `cd frontend/checkout_frontend && npm run dev`
4. Faça commit e push das alterações
5. A Vercel irá automaticamente fazer o deploy das atualizações

## 8. Integrações de Pagamento

Para integrar com provedores de pagamento reais:

1. Crie contas nos serviços desejados:
   - PIX: Mercado Pago, PagSeguro, etc.
   - Boleto: Juno, PagSeguro, etc.
   - Cartão de Crédito: Stripe, PagSeguro, etc.
2. Obtenha as chaves de API
3. Atualize o código em `backend/checkout_backend/src/routes/order.py` para usar as APIs reais
4. Adicione as chaves de API como variáveis de ambiente na Vercel

## Suporte

Para qualquer dúvida ou suporte adicional, entre em contato pelo e-mail fornecido.
