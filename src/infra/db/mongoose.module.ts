import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

export const MONGO_CONNECTION = Symbol('MONGO_CONNECTION');

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: MONGO_CONNECTION,
            useFactory: async (config: ConfigService) => {
                const uri = config.get<string>('MONGO_URI');
                if (!uri) {
                throw new Error('MONGO_URI não definida no .env');
                }
                // Conexão global (simples). Para projetos maiores, use createConnection() e models por conexão.
                mongoose.set('strictQuery', true);
                await mongoose.connect(uri);
                return mongoose.connection;
            },
            inject: [ConfigService],
        }
    ],
    exports: [MONGO_CONNECTION],
})
export class MongooseModule {}
