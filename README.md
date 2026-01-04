# ✅ ToDo – Full Stack Todo App

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Aplicação **Full Stack** de gerenciamento de tarefas, desenvolvida com foco em organização de código, validação de dados e uma experiência de uso clara e responsiva.

---

## 📌 Visão Geral

Este projeto simula um cenário real de desenvolvimento Full Stack moderno, contemplando:

- **API RESTful** com endpoints claros e semânticos
- **Validação de dados no backend** utilizando Jakarta Validation
- **Interface responsiva** com feedback visual imediato (Toasts)
- **Separação de responsabilidades** entre frontend e backend

---

## 🛠️ Tecnologias Utilizadas

### 🔙 Backend

- **Java 21+**
- **Spring Boot 4**
- **Spring Data JPA**
- **Jakarta Validation**
- **H2 Database** (ambiente de desenvolvimento)
- **Maven**

### 🎨 Frontend

- **Next.js 14 (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Context API** (ToastContext)
- **Fetch API** para comunicação com a API REST

---

## 🏗️ Estrutura do Projeto

### Backend

```
controller/   → Endpoints REST
service/      → Regras de negócio
domain/       → Entidades JPA
dto/          → Objetos de entrada e saída (Request/Response)
repository/   → Acesso aos dados
```

### Frontend

```
app/          → Rotas, páginas e layout
components/   → Componentes reutilizáveis
contexts/     → Contextos globais (Toast)
services/     → Integração com a API (api.ts)
```

---

## 📡 Endpoints da API

| Método | Endpoint                 | Descrição                     |
| -----: | ------------------------ | ----------------------------- |
|    GET | `/api/tasks`             | Lista todas as tarefas        |
|   POST | `/api/tasks`             | Cria uma nova tarefa          |
|    PUT | `/api/tasks/{id}`        | Atualiza uma tarefa existente |
|  PATCH | `/api/tasks/{id}/toggle` | Alterna o status da tarefa    |
| DELETE | `/api/tasks/{id}`        | Remove uma tarefa             |

---

## ⚠️ Validações e Tratamento de Erros

O backend utiliza **Jakarta Validation** para garantir a integridade dos dados:

- **Título**
  - Obrigatório
  - Mínimo de 3 caracteres
  - Máximo de 100 caracteres
- **Descrição**
  - Máximo de 255 caracteres

Em caso de erro de validação, a API retorna uma resposta estruturada com os campos inválidos.

> **Obs:** O frontend consome essas mensagens e exibe feedback visual ao usuário via Toasts e mensagens inline.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **JDK 17+**
- **Node.js 18+**
- **Maven**

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

API disponível em: `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em: `http://localhost:3000`

---

## 🧠 Conceitos Aplicados

- Arquitetura em camadas (Controller / Service / Repository)
- Validação de dados no backend
- Separação de responsabilidades
- Feedback de ações do usuário (Toasts)
- Integração Frontend ↔ Backend via API REST

---

## 👨‍💻 Autor

Desenvolvido por **Raphael Volkov**.
