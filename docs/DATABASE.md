# Documentação do Banco de Dados MongoDB
swagger-jsdoc
## Visão Geral

O projeto utiliza **MongoDB 7.0** como banco de dados NoSQL para armazenar informações de clientes, seguindo uma estrutura orientada a documentos com **Mongoose** como ODM.

## Tecnologias

- **MongoDB**: 7.0 (via Docker)
- **Mongoose**: ^8.19.2 (ODM para TypeScript/Node.js)
- **migrate-mongo**: Gerenciamento de migrações

## Estrutura do Banco de Dados

### Database

Nome da base de dados: definido pela `MONGO_URI` do arquivo `.env`

Exemplo:
```bash
MONGO_URI=mongodb://127.0.0.1:27017/crm
```

### Coleção: `customers`

Armazena informações completas dos clientes, incluindo dados pessoais, endereço, estágio no funil de vendas e produtos.

#### Schema Principal

```typescript
{
  // Identificação
  document: String,        // CPF ou CNPJ (único)
  person: String,          // 'F' (Física) ou 'J' (Jurídica)
  
  // Dados Pessoais
  name: String,            // Nome completo/razão social
  email: String,           // Email (único, parcialmente indexado)
  phone: String,           // Telefone
  active: Boolean,         // Status ativo/inativo
  
  // Endereço
  address: {
    postalCode: String,    // CEP
    street: String,        // Logradouro
    complement?: String,   // Complemento
    unit?: String,         // Número
    district: String,      // Bairro
    city: String,          // Cidade
    stateCode: String,     // UF (2 caracteres)
    state: String,         // Estado
    region: String         // Região
  },
  
  // Funil de Vendas
  stage: String,           // 'LEAD' | 'NEGOCIACAO' | 'VENDIDO'
  stageChangedAt: Date,    // Data da última mudança de estágio
  stageHistory: Array<{    // Histórico de mudanças
    from: String,
    to: String,
    at: Date,
    by?: String,           // Responsável
    note?: String
  }>,
  
  // Produtos
  products: Array<{
    _id: ObjectId,
    name: String,          // Nome do produto
    value: Number,         // Valor
    active: Boolean,       // Status ativo/inativo
    createdAt: Date,
    updatedAt: Date
  }>,
  
  // Timestamps automáticos (Mongoose)
  createdAt: Date,
  updatedAt: Date
}
```

## Índices

A coleção possui os seguintes índices para otimizar consultas:

### 1. Índice Único - Document
```javascript
{ document: 1 } // unique: true
```
**Uso**: Garantir unicidade de CPF/CNPJ

### 2. Índice Único Parcial - Email
```javascript
{ email: 1 } // unique: true, partialFilterExpression: { email: { $type: 'string' } }
```
**Uso**: Garantir unicidade de email quando presente

### 3. Índice de Texto - Busca Full-Text
```javascript
{ name: 'text', email: 'text' }
```
**Uso**: Busca textual em nome e email

### 4. Índice Composto - Stage e Status
```javascript
{ stage: 1, active: 1 }
```
**Uso**: Consultas por estágio e status ativo

### 5. Índice Parcial - Produtos Ativos
```javascript
{ 'products.name': 1 } // partialFilterExpression: { 'products.active': true }
```
**Uso**: Buscar apenas produtos ativos

## Migrações

O projeto utiliza **migrate-mongo** para gerenciar mudanças no schema do banco de dados.

### Configuração

Arquivo: `migrate-mongo-config.js`

```javascript
{
  mongodb: {
    mongoUri: process.env.MONGO_URI,
    databaseName: 'crm',
    options: {}
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  // ...
}
```

### Scripts Disponíveis

```bash
# Criar nova migration
npm run migrate:create nome-da-migration

# Executar migrations pendentes
npm run migrate:up

# Reverter última migration
npm run migrate:down

# Verificar status
npm run migrate:status
```

### Estrutura de uma Migration

```javascript
module.exports = {
  async up(db) {
    // Criar coleção
    await db.createCollection('customers');
    
    // Criar índices
    await db.collection('customers').createIndex({ document: 1 }, { unique: true });
    // ...
  },

  async down(db) {
    // Rollback
    await db.collection('customers').drop();
  }
};
```

## Conexão e Configuração

### Conexão Mongoose

Arquivo: `src/infra/db/connection.ts`

A aplicação utiliza um singleton para gerenciar a conexão MongoDB:

```typescript
export async function connectMongo(): Promise<void>
export async function disconnectMongo(): Promise<void>
```

**Características**:
- Conexão única reutilizável
- Logs de conexão/desconexão
- Tratamento de erros
- Graceful shutdown

### Variáveis de Ambiente

```bash
# Arquivo .env
MONGO_URI=mongodb://127.0.0.1:27017/cadastrar-clientes
MONGO_DBNAME=cadastrar-clientes  # Usado pelo migrate-mongo
```

## Arquitetura de Dados

### Camada de Repositório

O projeto segue o padrão **Repository Pattern** com:

- **BaseRepository**: Métodos CRUD genéricos
- **CustomerMongoRepository**: Implementação específica para clientes

**BaseRepository** (`src/base/repositories/base.repository.ts`):
- `create(doc: Partial<T>)`
- `findById(id: string)`
- `findOne(filter: FilterQuery<T>)`
- `findAll(filter, limit, skip, sort)`
- `updateById(id, update)`
- `deleteById(id)`

**CustomerMongoRepository** (`src/infra/db/repositories/customer.mongo.repository.ts`):
- `findByDocument(document: string)`
- `findByName(name: string)`
- `listByStage(stage, limit, skip)`
- `searchText(q, limit, skip)`
- `addProduct(id, name, value)`
- `updateProduct(id, productId, dto)`
- `changeStage(id, nextStage, by, note)`

### Models Mongoose

Arquivo: `src/infra/db/models/customer.schema.ts`

Define o schema MongoDB com:
- Validações de tipo
- Constraint de enum
- Índices automáticos
- Timestamps (`createdAt`, `updatedAt`)

## Operações de Exemplo

### Criar Cliente

```typescript
const customer = {
  document: '123.456.789-00',
  person: 'F',
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '(11) 98765-4321',
  address: {
    postalCode: '01310-100',
    street: 'Av. Paulista',
    district: 'Bela Vista',
    city: 'São Paulo',
    stateCode: 'SP',
    state: 'São Paulo',
    region: 'Sudeste'
  },
  stage: 'LEAD'
};
```

### Buscar por Document

```typescript
const customer = await repo.findByDocument('123.456.789-00');
```

### Buscar por Estágio

```typescript
const leads = await repo.listByStage('LEAD', 50, 0);
```

### Busca Full-Text

```typescript
const results = await repo.searchText('João');
```

### Adicionar Produto

```typescript
await repo.addProduct(customerId, 'Produto A', 1000.00);
```

### Mudar Estágio

```typescript
await repo.changeStage(
  customerId,
  'NEGOCIACAO',
  'user123',
  'Cliente interessado'
);
```

## Docker

### MongoDB Container

```yaml
mongodb:
  image: mongo:7
  ports:
    - "27017:27017"
  healthcheck:
    test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
```

### Mongo Express (Interface Web)

Acesso: `http://localhost:8081`

Sem autenticação (ambiente de desenvolvimento).

## Boas Práticas

1. **Validação**: Sempre validar dados antes de persistir
2. **Índices**: Criar índices apenas quando necessário para consultas frequentes
3. **Migrações**: Sempre usar migrações para mudanças no schema
4. **Lean Queries**: Usar `.lean()` quando possível para melhor performance
5. **Transactions**: Usar transações para operações atômicas quando necessário
6. **Sharding**: Considerar sharding para coleções grandes (>500GB)
7. **Backups**: Implementar backups regulares em produção

## Troubleshooting

### Erro: "E11000 duplicate key error"

**Causa**: Tentativa de inserir documento duplicado em campo único

**Solução**: Verificar se `document` ou `email` já existe

### Erro: "Connection timeout"

**Causa**: MongoDB não está acessível

**Solução**: Verificar se o container está rodando:
```bash
docker compose -f docker/docker-compose.yml ps mongodb
```

### Erro: "Cannot read property 'toArray' of undefined"

**Causa**: Collection não existe

**Solução**: Executar migrations:
```bash
npm run migrate:up
```

## Melhorias Futuras

- Implementar replica set para alta disponibilidade
- Adicionar indexes compostos adicionais baseados em padrões de consulta
- Implementar soft delete ao invés de hard delete
- Adicionar auditoria de mudanças em campos sensíveis
- Considerar separação de reads/writes com MongoDB Atlas
- Implementar paginação eficiente com cursor-based pagination

