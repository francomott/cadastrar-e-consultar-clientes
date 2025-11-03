import rabbitClient from '../../infra/messaging/rabbit.client';
import { ViaCepClient } from '../../infra/clients/viacep/viacep.cliente';
import { CustomerService } from '../services/customer.service';

/**
 * Consumer para eventos de cliente
 * Processa mensagens da fila e enriquece endereço via ViaCep
 */
export class CustomerConsumer {
  private readonly queueName = 'customer.created';
  private readonly viaCepClient = new ViaCepClient();
  private readonly customerService = new CustomerService();

  async start(): Promise<void> {
    try {
    await rabbitClient.consume(this.queueName, this.handleMessage.bind(this));
    } catch (error) {
      console.error(`.: Erro ao iniciar consumer da fila ${this.queueName}:`, error);
      throw error;
    }
  }

  /**
   * Processa mensagem recebida da fila
   * @param message Mensagem com customerId e postalCode
   */
  private async handleMessage(message: any): Promise<void> {
    const { customerId, postalCode } = message;
    
    console.log(`.: Consultando CEP - Cliente: ${customerId}, CEP: ${postalCode}`);

    try {
      const viaCepData = await this.viaCepClient.buscarPorCep(postalCode);
      
      const addressUpdate = {
        address: {
          postalCode: viaCepData.cep,
          street: viaCepData.logradouro || '',
          complement: viaCepData.complemento || '',
          unit: viaCepData.unidade || '',
          district: viaCepData.bairro || '',
          city: viaCepData.localidade || '',
          stateCode: viaCepData.uf || '',
          state: viaCepData.estado || '',
          region: viaCepData.regiao || '',
        },
      };
      
      await this.customerService.update(customerId, addressUpdate);
      
      console.log(`.: Endereço atualizado! - Cliente: ${customerId}`);
    } catch (error: any) {
        console.error(`.: Erro ao atualizar endereço do cliente ${customerId}:`, {
        error: error.message,
        postalCode,
        stack: error.stack,
      });
      
      // Não lançamos o erro para não bloquear o processamento
      // A mensagem será confirmada (ACK) mesmo com falha
    }
  }
}

