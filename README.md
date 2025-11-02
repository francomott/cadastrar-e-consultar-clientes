# Sistema de Cadastro e Consulta de Clientes

API REST construída com NestJS, TypeScript, MongoDB, Redis e RabbitMQ.

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
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/cadastrar-clientes
MONGO_DBNAME=cadastrar-clientes

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_URL=amqp://127.0.0.1:5672

# Aplicação
PORT=3000
NODE_ENV=development
MIGRATIONS=false
```

### 4. Subir Serviços (Docker)

```bash
docker compose -f docker/docker-compose.yml up -d
```

**Serviços disponíveis:**
- MongoDB: `localhost:27017`
- Mongo Express: `http://localhost:8081`
- Redis: `localhost:6379`
- RabbitMQ Management: `http://localhost:15672` (guest/guest)
- RabbitMQ AMQP: `localhost:5672`

### 5. Iniciar Aplicação

#### Desenvolvimento (hot-reload)

```bash
npm run dev
ou
npm run start:dev
```

#### Produção

```bash
npm run build
npm run start
```

A aplicação estará disponível em: **`http://localhost:3000`**

---

## 📝 Migrações (Opcional)

Executar migrações manualmente antes de iniciar:

```bash
npm run migrate:up
```

Verificar status:

```bash
npm run migrate:status
```

**Nota**: O script `start` pode executar migrações automaticamente se `MIGRATIONS=true` no `.env`.

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev                    # Inicia com hot-reload

# Build e Start
npm run build                  # Compila TypeScript
npm run start                  # Inicia aplicação (com migrações opcionais)
npm run start:app              # Inicia apenas a aplicação

# Validação
npm run lint                   # ESLint
npm run type-check             # Verifica tipos TypeScript

# Migrações
npm run migrate:create <nome>  # Cria nova migration
npm run migrate:up             # Executa migrações pendentes
npm run migrate:down           # Reverte última migration
npm run migrate:status         # Mostra status das migrações
```

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
├── app.module.ts              # Módulo raiz
├── main.ts                    # Entry point
├── auth/                      # Módulo de autenticação
├── customer/                  # Módulo de clientes (CRUD)
│   ├── controllers/
│   ├── services/
│   ├── entities/
│   └── dtos/
├── base/                      # Classes base (BaseEntity, BaseRepository)
└── infra/                     # Infraestrutura
    ├── db/                    # MongoDB (Mongoose)
    ├── cache/                 # Redis
    └── messaging/             # RabbitMQ
```

## 🏗️ Arquitetura

O projeto segue **Clean Architecture** com as seguintes camadas:

- **Domain**: Entidades e interfaces (ex: `Customer`, `BaseEntity`)
- **Application**: Casos de uso e serviços (ex: `CustomerService`)
- **Infrastructure**: Implementações concretas (MongoDB, Redis, RabbitMQ)
- **Presentation**: Controllers e DTOs (ex: `CustomerController`)

## 📝 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `MONGO_URI` | URI de conexão MongoDB | `mongodb://127.0.0.1:27017/cadastrar-clientes` |
| `MONGO_DBNAME` | Nome do banco de dados | `cadastrar-clientes` |
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

- [MIGRATIONS.md](./docs/MIGRATIONS.md) - Guia de migrações do MongoDB
- [CI-CD.md](./docs/CI-CD.md) - Documentação do pipeline CI/CD

## 🧪 Testes

```bash
npm test
```

**Nota**: Testes ainda não implementados (placeholder).

## 📄 Licença

Este projeto foi desenvolvido como parte de um teste prático.
