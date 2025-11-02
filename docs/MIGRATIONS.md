# Guia de Migrações MongoDB

Este projeto utiliza `migrate-mongo` para gerenciar migrações do banco de dados MongoDB.

## 📋 Pré-requisitos

- MongoDB rodando (via Docker ou localmente)
- Variável `MONGO_URI` configurada no `.env`

## 🚀 Criar uma Nova Migration

Para criar uma nova migration, use o comando:

```bash
npx migrate-mongo create nome-da-migration
```

**Exemplo:**
```bash
npx migrate-mongo create primeira-tabela
```

Este comando criará um arquivo em `migrations/` com o seguinte formato:
- Nome do arquivo: `{timestamp}-nome-da-migration.js`

## 📝 Estrutura de uma Migration

O arquivo gerado terá a seguinte estrutura:

```javascript
module.exports = {
  async up(db, client) {
    // Código para aplicar a migration
    // Exemplo: criar coleção, índices, etc.
  },

  async down(db, client) {
    // Código para reverter a migration
    // Exemplo: remover coleção, índices, etc.
  }
};
```

## 🔧 Comandos Disponíveis

### Ver Status das Migrações

```bash
npm run migrate:status
# ou
npx migrate-mongo status
```

Mostra quais migrações foram aplicadas e quais estão pendentes.

### Executar Migrações Pendentes

```bash
npm run migrate:up
# ou
npx migrate-mongo up
```

Executa todas as migrações que ainda não foram aplicadas.

### Reverter Última Migration

```bash
npm run migrate:down
# ou
npx migrate-mongo down
```

Reverte a última migration executada.

### Criar Nova Migration

```bash
npm run migrate:create nome-da-migration
# ou
npx migrate-mongo create nome-da-migration
```

## 📚 Exemplo Prático

### Criando uma Migration

```bash
npx migrate-mongo create primeira-tabela
```

Isso cria um arquivo como: `migrations/1234567890-primeira-tabela.js`

### Editando a Migration

```javascript
module.exports = {
  async up(db, client) {
    // Criar coleção de clientes com índice único em email
    await db.createCollection('customers');
    await db.collection('customers').createIndex({ email: 1 }, { unique: true });
  },

  async down(db, client) {
    // Reverter: remover coleção
    await db.collection('customers').drop();
  }
};
```

### Executando

```bash
npm run migrate:up
```

## ⚙️ Configuração

A configuração das migrações está em `migrate-mongo-config.js` e utiliza as seguintes variáveis:

- **MONGO_URI**: URI de conexão do MongoDB (ex: `mongodb://127.0.0.1:27017`)
- O nome do banco de dados é extraído da URI

**Estrutura da configuração:**
- `migrationsDir`: `migrations/` - diretório das migrações
- `changelogCollectionName`: `changelog` - coleção que rastreia migrações aplicadas
- `lockCollectionName`: `changelog_lock` - coleção para lock durante execução

## 🔄 Execução Automática

O projeto suporta execução automática de migrações ao iniciar a aplicação.

Configure no `.env`:
```env
MIGRATIONS=true
```

Ao executar `npm run start`, o script `scripts/start-with-migrations.js` executará as migrações antes de iniciar a aplicação.

## ⚠️ Notas Importantes

1. **Ordem das Migrações**: As migrações são executadas na ordem cronológica baseada no timestamp no nome do arquivo.

2. **Lock**: O `migrate-mongo` usa um lock para evitar execuções simultâneas. Se uma migration travar, você pode precisar remover o lock manualmente na coleção `changelog_lock`.

3. **Ambiente de Desenvolvimento**: Sempre teste suas migrations localmente antes de aplicar em produção.

4. **Backup**: Em produção, sempre faça backup do banco antes de executar migrations.

## 🐛 Troubleshooting

### Erro: "MONGO_URI não definida"

Verifique se a variável `MONGO_URI` está configurada no `.env`.

### Migration travada (lock)

Se uma migration travar, remova o lock:
```javascript
// No MongoDB
db.changelog_lock.deleteMany({})
```

### Reverter múltiplas migrations

O `migrate-mongo down` reverte apenas a última. Para reverter múltiplas, você precisará executar o comando várias vezes ou editar manualmente a coleção `changelog`.

## 📖 Referências

- [migrate-mongo GitHub](https://github.com/seppevs/migrate-mongo)
- [Documentação oficial](https://github.com/seppevs/migrate-mongo#migrate-mongo)

