# Mensageria - Enriquecimento de Endereço

## Descricao

Sistema de mensageria assíncrona usando **RabbitMQ** para enriquecer automaticamente os endereços dos clientes após o cadastro, utilizando a API pública **ViaCep**.

## Fluxo de Funcionamento

### 1. Cadastro do Cliente
Quando um cliente é criado via API (`POST /customers`), o sistema:
- Valida o documento (CPF/CNPJ)
- Cria o cliente no MongoDB com o `postalCode` informado
- Retorna imediatamente ao usuário (resposta rápida)
- **Publica uma mensagem** na fila `customer.created` do RabbitMQ

### 2. Mensagem Publicada


### 3. Processamento Assíncrono
O **Consumer** escuta a fila `customer.created` e:

1. **Recebe a mensagem** com `customerId` e `postalCode`
2. **Consulta a API ViaCep** para buscar os dados completos do endereço
3. **Recebe os dados** do ViaCep
4. **Atualiza o cliente** no MongoDB com todos os dados de endereço
5. **Confirma o processamento** da mensagem (ACK)

### 4. Resultado Final
O endereço do cliente fica completo.
