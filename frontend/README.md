# Cadastro e Gerenciamento de Usuários

Projeto individual do curso de Desenvolvimento Full Stack Básico (DFS-2025.2) que implementa um sistema completo de **CRUD** de usuários, com backend em Node.js/Express e frontend em React.

---

## 📋 Descrição

Uma aplicação web para cadastrar, listar, editar e excluir usuários, com dados pessoais (nome, e-mail, senha, telefone, data de nascimento, endereço) e upload de avatar. Inclui recursos avançados como busca, paginação, validações, feedback visual e modal de detalhes.

---

## 🚀 Funcionalidades

* **CRUD** de usuários (Create, Read, Update, Delete)
* Upload de avatar com remoção opcional
* Busca por nome e e-mail em tempo real
* Paginação de resultados
* Ordenação alfabética (A→Z / Z→A)
* Modal de detalhes com data de cadastro
* Validação de formulário (campos obrigatórios + regex de e-mail)
* Máscara de telefone no formato brasileiro
* Campo de senha com toggle mostrar/esconder
* Feedback visual com toasts (Bootstrap)
* Data de nascimento e data de cadastro salvas e formatadas
* Layout responsivo usando Bootstrap 5

---

## 🛠 Tecnologias Utilizadas

### Backend

* Node.js 16+
* Express
* Prisma ORM
* PostgreSQL
* Multer (upload de arquivos)
* Cors, dotenv

### Frontend

* React 18+
* Axios
* Bootstrap 5
* React-Bootstrap
* React-Bootstrap-Icons

---

## 📦 Instalação e Execução

1. **Clone o repositório**:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd PROJETO-DFS-2025.2
   ```

2. **Configurar o backend**:

   ```bash
   cd backend
   cp .env.example .env
   # Edite .env e defina DATABASE_URL (PostgreSQL)
   npm install
   npx prisma migrate dev --name init
   npm run dev
   ```

   O servidor backend ficará acessível em `http://localhost:5000`.

3. **Configurar o frontend**:

   ```bash
   cd ../frontend
   npm install
   npm start
   ```

   O frontend será aberto em `http://localhost:3000`.

---

## 📁 Estrutura do Projeto

```
backend/        # API REST (Express + Prisma)
  ├─ index.js   # Entrypoint do servidor
  ├─ prisma/    # Migrations e schema
  └─ uploads/   # Avatares enviados

frontend/       # UI em React
  ├─ src/
  │  ├─ components/   # Componentes React (Form, Lista, Modal, Toast)
  │  ├─ services/api.js
  │  └─ App.js
  └─ public/
