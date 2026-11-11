<div align="center">

# 💸 Refund API

**API REST para solicitações de reembolso de despesas corporativas, com upload de comprovantes e acesso por perfil.**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

</div>

---

## 💡 Sobre

O Refund API simplifica o fluxo de reembolso em empresas: o funcionário envia a foto do comprovante e registra a despesa em uma categoria; o gestor lista, pesquisa e audita todas as solicitações. Projeto prático desenvolvido durante a formação Node.js da Rocketseat.

## ✨ Funcionalidades

- 🔐 Cadastro com senha criptografada (bcrypt) e login com JWT
- 🛡️ Controle de acesso por perfil (`employee` / `manager`)
- 📎 Upload de comprovantes (JPEG/PNG) via Multer, servidos estaticamente em `/uploads`
- 🧾 Solicitações de reembolso por categoria: `food`, `accommodation`, `transport`, `services`, `others`
- 🔎 Listagem paginada com busca por nome (`?name=&page=&perPage=`)
- ✅ Validação com Zod e tratamento global de erros (`AppError`)

## 🛠️ Tecnologias

Node.js · TypeScript · Express · Prisma ORM · SQLite · JWT · bcrypt · Multer · Zod · tsx

## 🔄 Fluxo

```mermaid
sequenceDiagram
    actor F as Funcionário
    actor G as Gestor
    participant API
    F->>API: POST /sessions (JWT)
    F->>API: POST /uploads (comprovante)
    API-->>F: filename
    F->>API: POST /refunds (nome, valor, categoria, filename)
    G->>API: GET /refunds?name=&page=
    G->>API: GET /refunds/:id
    G->>API: GET /uploads/:filename
```

## 📌 Endpoints

Rotas privadas exigem `Authorization: Bearer <token>`.

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/users` | Público | Cadastra um usuário |
| `POST` | `/sessions` | Público | Autentica e retorna o token JWT |
| `POST` | `/uploads` | `employee` | Envia o comprovante (`multipart/form-data`, campo `file`) |
| `POST` | `/refunds` | `employee` | Cria uma solicitação de reembolso |
| `GET` | `/refunds` | `manager` | Lista solicitações com busca e paginação |
| `GET` | `/refunds/:id` | `employee`, `manager` | Detalha uma solicitação |
| `GET` | `/uploads/:filename` | Público | Arquivo do comprovante (estático) |

## 🗄️ Banco de dados

SQLite (`prisma/dev.db`) com Prisma:

```mermaid
erDiagram
    USERS ||--o{ REFUNDS : "solicita"
    USERS {
        string id PK
        string name
        string email UK
        string password
        UserRole role
    }
    REFUNDS {
        string id PK
        string name
        float amount
        Category category
        string filename
        string user_id FK
    }
```

## 🚀 Como rodar

Pré-requisitos: Node.js 18+ e npm.

```bash
# 1. Instalar dependências
npm install

# 2. Criar/atualizar o banco SQLite
npx prisma migrate dev

# 3. Subir a API
npm run dev
```

A API sobe em `http://localhost:3333`. Não há variáveis de ambiente — o banco e as configurações de JWT ficam em `prisma/schema.prisma` e `src/configs/auth.ts`.

> ⚠️ A chave do JWT está fixa no código para fins de estudo. Em produção, mova-a para uma variável de ambiente.

## 👤 Autor

Feito por [Kevin Lopes](https://github.com/KevinLopes23)
