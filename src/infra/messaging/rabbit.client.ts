import amqp from 'amqplib';

type MessageHandler = (message: any) => Promise<void>;

/**
 * Cliente RabbitMQ para publicação e consumo de mensagens
 * Implementa singleton pattern para reutilizar conexão
 */
export class RabbitMQClient {
  private static instance: RabbitMQClient;
  private connection: any = null;
  private channel: any = null;
  private readonly url: string;

  private constructor() {
    this.url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
  }

  static getInstance(): RabbitMQClient {
    if (!RabbitMQClient.instance) {
        RabbitMQClient.instance = new RabbitMQClient();
    }
    return RabbitMQClient.instance;
  }

  async connect(): Promise<void> {
    if (this.connection && this.channel) {
        return;
    }

    try {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
        
        console.log('.: RabbitMQ conectado com sucesso');
        
        this.connection.on('error', (err: any) => {
            console.error('.: Erro na conexão RabbitMQ:', err);
        });
      
        this.connection.on('close', () => {
            console.log('.: Conexão RabbitMQ fechada');
        });
    } catch (error) {
      console.error('.: Erro ao conectar no RabbitMQ:', error);
        throw error;
    }
  }

  /**
   * Publica mensagem em uma fila
   * @param queue Nome da fila
   * @param message Objeto a ser enviado (será convertido para JSON)
   */
  async publish(queue: string, message: object): Promise<void> {
    if (!this.channel) {
        throw new Error('Canal RabbitMQ não está conectado');
    }

    try {
        await this.channel.assertQueue(queue, { durable: true });
        
        const sent = this.channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(message)),
            { persistent: true }
        );

        if (!sent) {
            console.warn(`.: Mensagem para fila ${queue} não foi enviada (buffer cheio)`);
        }
    } catch (error) {
        console.error(`.: Erro ao publicar mensagem na fila ${queue}:`, error);
        throw error;
    }
  }

  /**
   * Consome mensagens de uma fila
   * @param queue Nome da fila
   * @param handler Função que processa a mensagem
   */
  async consume(queue: string, handler: MessageHandler): Promise<void> {
    if (!this.channel) {
        throw new Error('Canal RabbitMQ não está conectado');
    }

    try {
        await this.channel.assertQueue(queue, { durable: true });
        
        this.channel.prefetch(1);
        
        await this.channel.consume(
            queue,
            async (msg: amqp.ConsumeMessage | null) => {
                if (!msg) {
                    return;
                }

                try {
                    const content = JSON.parse(msg.content.toString());
                    
                    // Processa mensagem
                    await handler(content);
                    
                    this.channel?.ack(msg);
                } catch (error) {
                    console.error(`.: Erro ao processar mensagem da fila ${queue}:`, error);
                    

                    this.channel?.nack(msg, false, false);
                }
                },
                { noAck: false }
        );
    } catch (error) {
      console.error(`.: Erro ao consumir fila ${queue}:`, error);
      throw error;
    }
  }

  /**
   * Desconecta do RabbitMQ
   */
  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      
      console.log('.: RabbitMQ desconectado');
    } catch (error) {
      console.error('.: Erro ao desconectar RabbitMQ:', error);
      throw error;
    }
  }
}

// Exporta instância única
export default RabbitMQClient.getInstance();

