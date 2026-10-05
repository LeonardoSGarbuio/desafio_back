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
* **pg (node-postgres)**: Cliente PostgreSQL para execução direta de queries SQL.
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

O projeto conta com um script automatizado que lê o arquivo `sql/schema.sql` e cria as tabelas `courses`, `modules` e `lessons` com os tipos e chaves estrangeiras (`ON DELETE CASCADE`):

```bash
npm run migrate
```

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

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/health` | Verificação rápida de status do servidor |
| `GET` | `/courses` | Retorna a lista de cursos cadastrados |
| `GET` | `/courses/:id` | Retorna os detalhes de um curso específico (com módulos e aulas ordenados) |

---

## 10. Exemplos de Utilização da API

### 1. Listagem de Cursos

**Requisição:**
```bash
curl -X GET http://localhost:3001/courses
```

**Resposta de Sucesso (`200 OK`):**
```json
[
  {
    "id": "1",
    "title": "Desenvolvimento Web Fullstack",
    "category": "Programação",
    "shortDescription": "Introdução prática ao desenvolvimento web, do front ao back.",
    "thumbnail": "https://exemplo.com/fullstack.jpg",
    "modulesCount": 2
  },
  {
    "id": "2",
    "title": "Banco de Dados com PostgreSQL",
    "category": "Banco de Dados",
    "shortDescription": "Modelagem, consultas e relacionamentos em PostgreSQL.",
    "thumbnail": "https://exemplo.com/postgres.jpg",
    "modulesCount": 1
  }
]
```

---

### 2. Detalhes de um Curso Específico

**Requisição:**
```bash
curl -X GET http://localhost:3001/courses/1
```

**Resposta de Sucesso (`200 OK`):**
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
        },
        {
          "id": "2",
          "title": "HTML e CSS",
          "description": "Estrutura e estilo de páginas.",
          "duration": 20,
          "order": 2
        }
      ]
    },
    {
      "id": "2",
      "title": "Backend",
      "order": 2,
      "lessons": [
        {
          "id": "4",
          "title": "Node.js",
          "description": "Rodando JavaScript no servidor.",
          "duration": 30,
          "order": 1
        }
      ]
    }
  ]
}
```

---

### 3. Tratamento de Erros

* **Parâmetro Inválido (`400 Bad Request`)**  
  Requisição com ID não numérico ou menor/igual a zero (ex: `GET /courses/abc` ou `GET /courses/0`):
  ```json
  {
    "message": "ID de curso inválido."
  }
  ```

* **Curso Inexistente (`404 Not Found`)**  
  Requisição com ID inexistente no banco (ex: `GET /courses/999`):
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
