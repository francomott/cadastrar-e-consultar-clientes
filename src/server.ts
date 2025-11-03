import 'dotenv/config';
import { connectMongo, disconnectMongo } from './infra/db/connection';
import { createApp } from './app';
import rabbitClient from './infra/messaging/rabbit.client';
import { CustomerConsumer } from './customer/events/customer.consumer';

async function bootstrap() {
  await connectMongo();
  
  // Conecta ao RabbitMQ e inicia consumer
  await rabbitClient.connect();
  const consumer = new CustomerConsumer();
  await consumer.start();
  
  const app = createApp();
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  
  const server = app.listen(PORT, () => {
    console.log(`.: HTTP server running on port ${PORT}`);
    console.log(`.: API documentation (Swagger - FOR TESTS): http://localhost:${PORT}/docs`);
  });

  const shutdown = async (signal: string) => {
    console.log(`\n[${signal}] Encerrando aplicação...`);
    server.close(async () => {
      await rabbitClient.disconnect();
      await disconnectMongo();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('.: Erro fatal ao iniciar servidor:', err);
  process.exit(1);
});
