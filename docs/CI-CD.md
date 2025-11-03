# Documentação CI/CD

## Visão Geral

Pipeline GitHub Actions com 4 jobs: **validate** → **migrations** → **package** → **release** (condicional).

```
validate → migrations → package → release
           (sempre)    (main/tags) (tags v*)
```

## Triggers

- **PR para `main`**: Executa `validate` + `migrations`
- **Push em `main`**: Executa `validate` + `migrations` + `package`
- **Tag `v*`** (ex: `v1.0.0`): Pipeline completo + `release`

## Jobs

### 1. `validate`
Valida código antes de prosseguir (gatekeeper).

**Executa**: `lint` → `type-check` → `test` → `build`  
**Timeout**: 20min  
**Node**: 20.19.5

### 2. `migrations`
Valida migrações MongoDB em ambiente limpo.

**Ambiente**: MongoDB 7.0 (porta 27017), database `ci_db`  
**Executa**: Aguarda MongoDB → `migrate:status` → `migrate:up`  
**Timeout**: 15min

### 3. `package`
Cria artifact tar.gz para deploy.

**Condição**: Apenas `push` em `main` ou tags `v*`  
**Conteúdo**: `dist/` + `package.json` → `app-{SHA}.tar.gz`  
**Retenção**: 90 dias (padrão GitHub)

### 4. `release`
Cria GitHub Release com artifact anexado.

**Condição**: Apenas tags `v*`  
**Permissões**: `contents: write`  
**Release notes**: Geradas automaticamente

## Configuração

**Node.js**: 20.19.5 (`.nvmrc`)  
**TypeScript**: ES2020, CommonJS → `dist/`  
**Framework**: Express.js  
**MongoDB CI**: `mongo:7`, porta 27017

**Concurrency**: Workflows anteriores são cancelados quando novo commit/push ocorre para mesma branch/tag.

## Scripts Principais

```json
{
  "lint": "eslint . --ext .ts --max-warnings=0",
  "type-check": "tsc -p tsconfig.json --noEmit",
  "test": "echo \"No tests yet\" && exit 0",
  "build": "tsc -p tsconfig.json",
  "migrate:up": "npx migrate-mongo up",
  "migrate:status": "npx migrate-mongo status",
  "start": "node --env-file=.env scripts/start-with-migrations.js"
}
```

**Nota**: `start` executa migrações automaticamente se `MIGRATIONS=true`.

## Fluxo de Deploy

### PR
1. Abrir PR → `main`
2. CI executa: `validate` + `migrations`
3. Revisar e aprovar

### Deploy Main
1. Merge → `main`
2. CI executa: `validate` + `migrations` + `package`
3. Artifact disponível para download

### Deploy Release
```bash
git tag v1.0.0
git push origin v1.0.0
```
1. Push tag `v*`
2. CI executa pipeline completo + cria GitHub Release
3. Release com artifact anexado

## Troubleshooting

**`validate` falha**: Verificar lint, type-check, testes ou build  
**`migrations` falha**: Verificar MongoDB, sintaxe das migrações, `migrate-mongo-config.js`  
**`package` não executa**: Verificar se está em `main` ou tag `v*`  
**`release` não executa**: Verificar formato da tag (`v*`) e permissões do repositório

**Logs**: Disponíveis na aba "Actions" do GitHub.

## Melhorias Futuras

- Implementar testes reais (atualmente placeholder)
- Adicionar coverage e security scanning
- Deploy automático após release
- Build de imagem Docker
