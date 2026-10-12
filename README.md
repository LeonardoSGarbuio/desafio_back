# Plataforma Comando - Backend de Cursos (API REST)

## 1. Descrição do Projeto

API REST desenvolvida para a plataforma de ensino **Comando**, responsável por disponibilizar informações sobre os cursos do catálogo para o consumo da aplicação frontend (área do aluno).

A API fornece a listagem geral dos cursos e a consulta detalhada de cada curso, estruturada na hierarquia **Curso ➔ Módulos ➔ Aulas**. O projeto adota a arquitetura de **Monólito Modular**, com divisão clara de responsabilidades entre rotas, controladores, serviços e acesso a dados.

---

## 2. Tecnologias Utilizadas

* **Node.js** (v18+)
* **TypeScript**
* **Express**: Framework web minimalista para criação das rotas e middlewares.
* **PostgreSQL**: Banco de dados relacional para persistência dos dados.
* **Prisma ORM**: Modelagem de dados, migrações automatizadas e consultas type-safe.
* **tsx**: Executor TypeScript para ambiente de desenvolvimento sem etapa prévia de build manual.
* **dotenv**: Gerenciamento de variáveis de ambiente.
* **cors**: Middleware para liberação de requisições cross-origin para o frontend.
* **Git**: Controle de versão com branch dedicada e commits semânticos.

---

## 3. Como Instalar

Clone o repositório e acerte a branch da funcionalidade:

```bash
git clone https://github.com/SEU_USUARIO/NOME_DO_REPO
cd backend
git checkout feature/backend-courses
```

Instale as dependências:

```bash
npm install
```

---

## 4. Como Configurar o Ambiente

Copie o arquivo de exemplo para criar o `.env` local:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e configure as credenciais da sua conexão com o PostgreSQL e a porta da aplicação:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/comando"
PORT=3001
```

> **Nota de Integração**: A porta recomendada é `3001` para evitar conflito com a porta `3000` padrão utilizada pelo Next.js no frontend.

---

## 5. Como Configurar o Banco de Dados

Certifique-se de que o serviço do PostgreSQL está ativo e crie uma base de dados chamada `comando`.

### Opção A: PostgreSQL instalado localmente

No terminal ou via `psql`:

```sql
CREATE DATABASE comando;
```

### Opção B: Via Docker

Caso prefira rodar um container rápido:

```bash
docker run --name comando-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=comando -p 5432:5432 -d postgres
```

*(Nesse caso, a `DATABASE_URL` no `.env` seria `postgresql://postgres:postgres@localhost:5432/comando`).*

---

## 6. Como Executar Migrations

As migrações do banco de dados são gerenciadas pelo **Prisma Migrate** a partir do schema em `prisma/schema.prisma`:

```bash
npm run migrate
```

> O comando executa o `prisma migrate deploy`, aplicando todas as migrações versionadas de forma segura e sem alterar dados existentes.

---

## 7. Como Inserir os Dados Iniciais (Seed)

Para popular o banco com uma massa inicial de testes (3 cursos completos, múltiplos módulos e aulas com duração e descrições):

```bash
npm run seed
```

> O script possui verificação preventiva: se já existirem cursos cadastrados na base, a inserção é ignorada para evitar duplicações.

---

## 8. Como Executar o Servidor

### Ambiente de Desenvolvimento

```bash
npm run dev
```

A API iniciará e estará acessível em:
`http://localhost:3001`

---

## 9. Rotas Disponíveis

### Cursos (`/courses`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/courses` | Retorna a lista de cursos cadastrados |
| `GET` | `/courses/:id` | Retorna os detalhes de um curso específico (com módulos e aulas ordenados) |
| `POST` | `/courses` | Cria um novo curso |
| `PUT` | `/courses/:id` | Atualiza os dados de um curso existente |
| `DELETE` | `/courses/:id` | Remove um curso (e seus módulos/aulas em cascata) |

### Módulos (`/modules`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/modules/:id` | Retorna os detalhes de um módulo e suas aulas |
| `POST` | `/modules` | Cria um novo módulo vinculado a um curso |
| `PUT` | `/modules/:id` | Atualiza dados de um módulo existente |
| `DELETE` | `/modules/:id` | Remove um módulo (e suas aulas em cascata) |

### Aulas (`/lessons`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/lessons/:id` | Retorna os detalhes de uma aula específica |
| `POST` | `/lessons` | Cria uma nova aula vinculada a um módulo |
| `PUT` | `/lessons/:id` | Atualiza dados de uma aula existente |
| `DELETE` | `/lessons/:id` | Remove uma aula existente |

### Utilitários
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/health` | Verificação rápida de status do servidor |

---

## 10. Exemplos de Utilização da API

### 1. Listagem de Cursos

**Requisição:**
```bash
curl -X GET http://localhost:3001/courses
```

**Resposta (`200 OK`):**
```json
[
  {
    "id": "1",
    "title": "Desenvolvimento Web Fullstack",
    "category": "Programação",
    "shortDescription": "Introdução prática ao desenvolvimento web, do front ao back.",
    "thumbnail": "https://exemplo.com/fullstack.jpg",
    "modulesCount": 2
  }
]
```

---

### 2. Detalhes de um Curso Específico

**Requisição:**
```bash
curl -X GET http://localhost:3001/courses/1
```

**Resposta (`200 OK`):**
```json
{
  "id": "1",
  "title": "Desenvolvimento Web Fullstack",
  "category": "Programação",
  "description": "Introdução prática ao desenvolvimento web, do front ao back.",
  "thumbnail": "https://exemplo.com/fullstack.jpg",
  "modules": [
    {
      "id": "1",
      "title": "Fundamentos",
      "order": 1,
      "lessons": [
        {
          "id": "1",
          "title": "Introdução à Web",
          "description": "Como a internet funciona.",
          "duration": 15,
          "order": 1
        }
      ]
    }
  ]
}
```

---

### 3. Criação de Recursos (POST)

#### Criar Curso
```bash
curl -X POST http://localhost:3001/courses \
  -H "Content-Type: application/json" \
  -d '{"title": "DevOps Essencial", "category": "Infraestrutura", "description": "Do zero ao deploy"}'
```

*Resposta (`201 Created`):*
```json
{
  "id": "4",
  "title": "DevOps Essencial",
  "description": "Do zero ao deploy",
  "thumbnail": null,
  "category": "Infraestrutura"
}
```

#### Criar Módulo
```bash
curl -X POST http://localhost:3001/modules \
  -H "Content-Type: application/json" \
  -d '{"courseId": 4, "title": "Introdução a Containers", "order": 1}'
```

*Resposta (`201 Created`):*
```json
{
  "id": "6",
  "courseId": "4",
  "title": "Introdução a Containers",
  "order": 1
}
```

#### Criar Aula
```bash
curl -X POST http://localhost:3001/lessons \
  -H "Content-Type: application/json" \
  -d '{"moduleId": 6, "title": "O que é Docker?", "duration": 15, "order": 1, "description": "Conceitos básicos"}'
```

*Resposta (`201 Created`):*
```json
{
  "id": "13",
  "moduleId": "6",
  "title": "O que é Docker?",
  "description": "Conceitos básicos",
  "duration": 15,
  "order": 1
}
```

---

### 4. Atualização e Exclusão (PUT e DELETE)

#### Atualizar Recurso (`PUT`)
```bash
curl -X PUT http://localhost:3001/courses/4 \
  -H "Content-Type: application/json" \
  -d '{"title": "DevOps & Cloud Essencial"}'
```

*Resposta (`200 OK` com dados atualizados).*

#### Deletar Recurso (`DELETE`)
```bash
curl -X DELETE http://localhost:3001/courses/4
```

*Resposta (`200 OK`):*
```json
{
  "message": "Curso removido com sucesso."
}
```

---

### 5. Tratamento de Erros

* **Parâmetro ou Campo Inválido (`400 Bad Request`)**  
  Requisição com ID inválido ou campos obrigatórios ausentes:
  ```json
  {
    "message": "ID de curso inválido."
  }
  ```

* **Recurso Não Encontrado (`404 Not Found`)**  
  Requisição com ID de curso, módulo ou aula inexistente:
  ```json
  {
    "message": "Curso não encontrado"
  }
  ```

* **Erro Interno do Servidor (`500 Internal Server Error`)**  
  Em caso de falha de conexão com o banco ou exceção não esperada:
  ```json
  {
    "message": "Erro interno ao buscar curso"
  }
  ```
