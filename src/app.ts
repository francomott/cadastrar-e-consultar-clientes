import express from 'express';
import yaml from 'yaml';
import fs from 'node:fs';
import path from 'node:path'
import passport from './auth/passport';
import { requireAuth } from './auth/passport';
import authRoutes from './auth/auth.routes';
import customerRoutes from './customer/customer.routes';
import { generateSwaggerHTML } from './utils/swagger-html';

export function createApp() {
  const app = express();
  
  app.use(express.json());
  app.use(passport.initialize());
  
  // swagger 
  try {
    const specPath = path.join(__dirname, '../docs/openapi.yaml');
    const spec = fs.readFileSync(specPath, 'utf8');
    const openapiDoc = yaml.parse(spec);
    
    // Servir o spec como JSON
    app.get('/api-docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.json(openapiDoc);
    });
    
    // Servir HTML customizado com Swagger UI via CDN
    app.get('/docs', (_req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.send(generateSwaggerHTML());
    });
    
  } catch (error) {
    console.error('.: Erro ao carregar Swagger:', error);
    app.get('/docs', (_req, res) => {
      res.status(500).send(`<h1>Erro ao carregar documentação</h1><pre>${error}</pre>`);
    });
  }

  // Healthcheck simples (útil pro Docker/CI)
  app.get('/health', (_req, res) => res.json({ ok: true }));
  app.use('/auth', authRoutes);

  // Rotas de clientes protegidas por autenticação
  app.use('/customers', requireAuth, customerRoutes);

  app.use((_req, res) => res.status(404).json({ message: 'Not Found' }));

  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
  });

  return app;
}
