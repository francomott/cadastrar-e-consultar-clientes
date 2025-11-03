import rabbitClient from '../../infra/messaging/rabbit.client';

export class CustomerPublisher {
  private readonly queueName = 'customer.created';

  /**
   * Publica evento de cliente criado
   * @param customerId ID do cliente criado
   * @param postalCode CEP do cliente para enriquecimento de endereço
   */
  async publishCustomerCreated(customerId: string, postalCode: string): Promise<void> {
    try {
      const message = {
        customerId,
        postalCode,
        timestamp: new Date().toISOString(),
      };

      await rabbitClient.publish(this.queueName, message);
      
      console.log(`.: Evento customer.created publicado - Cliente: ${customerId}`);
    } catch (error) {
      console.error('.: Erro ao publicar evento customer.created:', error);
    }
  }
}

