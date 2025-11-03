# Sistema de Cadastro e Consulta de Clientes

API REST construída com Express.js, TypeScript, MongoDB, Redis e RabbitMQ.

## 📋 Pré-requisitos

- **Node.js**: 20.19.5 (definido em `.nvmrc`)
- **Docker** e **Docker Compose**
- **NVM** (recomendado) ou instalação manual do Node.js

## 🚀 Como Iniciar

### 1. Configurar Node.js

```bash
nvm use
```

### 2. Instalar Dependências

```bash
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, utilize o exemplo no `.env.exemple`.

**Gerando o JWT_SECRET:**

Execute um dos comandos abaixo para gerar uma chave segura:

```bash
# Opção 1: Node.js (Recomendado)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opção 2: OpenSSL
openssl rand -hex 64
```

Copie a chave gerada e adicione no seu arquivo `.env`:
```
JWT_SECRET=sua_chave_gerada_aqui
```

### 4. Subir Serviços (Docker)

```bash
docker compose -f docker/docker-compose.yml up -d
```

**Serviços disponíveis:**
- MongoDB: `localhost:27017`
- Mongo Express: `http://localhost:8081` (sem autenticação)
- Redis: `localhost:6379`
- RabbitMQ Management: `http://localhost:15672` (guest/guest)
- RabbitMQ AMQP: `localhost:5672`

### 5. Iniciar Aplicação

#### Desenvolvimento (hot-reload)

```bash
pnpm dev
```

#### Produção

```bash
pnpm build
pnpm start
```

A aplicação estará disponível em: **`http://localhost:3000`**

---

## 📝 Migrações (Opcional)

Executar migrações manualmente antes de iniciar:

```bash
pnpm migrate:up
```

Verificar status:

```bash
pnpm migrate:status
```

**Nota**: O script `start` pode executar migrações automaticamente se `MIGRATIONS=true` no `.env`.

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev                    # Inicia com hot-reload

# Build e Start
pnpm build                  # Compila TypeScript
pnpm start                  # Inicia aplicação (com migrações opcionais)
pnpm start:app              # Inicia apenas a aplicação

# Validação
pnpm lint                   # ESLint
pnpm type-check             # Verifica tipos TypeScript

# Migrações
pnpm migrate:create <nome>  # Cria nova migration
pnpm migrate:up             # Executa migrações pendentes
pnpm migrate:down           # Reverte última migration
pnpm migrate:status         # Mostra status das migrações
```

## 🧪 Testando APIs com Swagger

A aplicação disponibiliza uma interface interativa Swagger UI para testar todos os endpoints da API:

**Acesse:** `http://localhost:3000/docs`

### Como usar:

1. **Gerar token de autenticação**
   - Acesse o endpoint `GET /auth/token`
   - Clique em "Try it out" e depois em "Execute"
   - Copie o valor do campo `access_token` da resposta

2. **Autenticar no Swagger**
   - Clique no botão "Authorize" no topo da página
   - Cole o token copiado no campo "Value"
   - Clique em "Authorize" e depois em "Close"

3. **Testar endpoints**
   - Navegue pelos endpoints disponíveis
   - Clique em "Try it out" para habilitar a edição
   - Preencha os parâmetros necessários
   - Clique em "Execute" para enviar a requisição
   - Visualize a resposta da API

**Nota:** Todos os endpoints (exceto `/health` e `/auth/token`) requerem autenticação.

## 🔧 Comandos Úteis

### Docker

```bash
# Parar serviços
docker compose -f docker/docker-compose.yml down

# Parar e remover volumes (limpa dados)
docker compose -f docker/docker-compose.yml down -v

# Ver logs
docker compose -f docker/docker-compose.yml logs -f

# Ver logs de um serviço específico
docker compose -f docker/docker-compose.yml logs -f mongodb
```

### Migrações

```bash
# Criar nova migration
npx migrate-mongo create nome-da-migration

# Ver status
npx migrate-mongo status

# Executar todas
npx migrate-mongo up

# Reverter última
npx migrate-mongo down
```

## 📁 Estrutura do Projeto

```
src/
├── server.ts                  # Entry point da aplicação
├── app.ts                     # Configuração Express
├── auth/                      # Rotas de autenticação
│   ├── auth.routes.ts
│   ├── passport.ts
│   └── types.ts
├── customer/                  # Módulo de clientes (CRUD)
│   ├── customer.routes.ts     # Rotas
│   ├── services/              # Services
│   │   ├── customer.service.ts
│   │   ├── product.service.ts
│   │   └── stage.service.ts
│   ├── entities/              # Entidades
│   ├── dtos/                  # DTOs
│   └── enums/                 # Enumeradores
├── base/                      # Classes base
│   ├── entities/
│   │   └── base.entity.ts
│   └── repositories/
│       └── base.repository.ts
└── infra/                     # Infraestrutura
    ├── db/                    # MongoDB (Mongoose)
    │   ├── connection.ts
    │   ├── models/
    │   └── repositories/
    ├── cache/                 # Redis
    │   └── redis.client.ts
    ├── http/                  # Middlewares HTTP
    │   └── error-handler.ts
    └── messaging/             # RabbitMQ
        └── rabbit.client.ts
```

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com as seguintes camadas:

- **Domain**: Entidades e interfaces (ex: `CustomerEntity`, `BaseEntity`)
- **Application**: Casos de uso e serviços (ex: `CustomerService`, `ProductService`, `StageService`)
- **Infrastructure**: Implementações concretas (MongoDB, Redis, RabbitMQ)
- **Presentation**: Rotas Express e DTOs (ex: `customer.routes.ts`)

## 📝 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `MONGO_URI` | URI de conexão MongoDB | `mongodb://127.0.0.1:27017/crm` |
| `MONGO_DBNAME` | Nome do banco de dados (usado pelo migrate-mongo) | `crm` |
| `REDIS_HOST` | Host do Redis | `127.0.0.1` |
| `REDIS_PORT` | Porta do Redis | `6379` |
| `RABBITMQ_URL` | URL do RabbitMQ | `amqp://127.0.0.1:5672` |
| `PORT` | Porta da aplicação | `3000` |
| `NODE_ENV` | Ambiente de execução | `development` ou `production` |
| `MIGRATIONS` | Executar migrações ao iniciar | `true` ou `false` |

## 🐛 Troubleshooting

### Erro ao conectar no MongoDB

Verifique se o container está rodando:
```bash
docker compose -f docker/docker-compose.yml ps mongodb
```

Verifique a variável `MONGO_URI` no `.env`.

### Erro ao conectar no Redis

Verifique se o container está rodando:
```bash
docker compose -f docker/docker-compose.yml ps redis
```

### Porta já em uso

Altere a porta no `.env` ou pare o processo:
```bash
lsof -ti:3000 | xargs kill -9
```

### Migrações não executam

Verifique se o `MONGO_URI` está correto no `.env` e se o MongoDB está acessível.

## 📚 Documentação Adicional

- [DATABASE.md](./docs/DATABASE.md) - Documentação completa do MongoDB
- [MIGRATIONS.md](./docs/MIGRATIONS.md) - Guia de migrações do MongoDB
- [CI-CD.md](./docs/CI-CD.md) - Documentação do pipeline CI/CD
- [PROPOSAL.md](./docs/PROPOSAL.md) - Proposta original do projeto

## 🧪 Testes

```bash
npm test
```

**Nota**: Testes ainda não implementados (placeholder).

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste prático.
