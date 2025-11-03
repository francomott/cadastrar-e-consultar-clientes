import 'dotenv/config';
import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongo(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('.: Variável MONGO_URI não encontrada no ambiente.');
  }

  if (isConnected) {
    console.log('[MongoDB] já conectado, reusando conexão.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);

    isConnected = true;
    console.log(`[MongoDB] conectado em: ${mongoUri}`);
  } catch (error) {
    console.error('[MongoDB] erro ao conectar:', error);
    throw error; 
  }
}

export async function disconnectMongo(): Promise<void> {
  if (!isConnected) return;

  await mongoose.disconnect();
  isConnected = false;
  console.log('[MongoDB] desconectado.');
}
