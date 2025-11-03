import axios from 'axios';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export class ViaCepClient {
  private readonly baseUrl = 'https://viacep.com.br/ws';

  async buscarPorCep(cep: string): Promise<ViaCepResponse> {
    const sanitizedCep = cep.replace(/\D/g, ''); // remove pontos e traços
    const url = `${this.baseUrl}/${sanitizedCep}/json/`;

    try {
        const { data } = await axios.get<ViaCepResponse>(url, {
            headers: { Accept: 'application/json' },
        });

        if ('erro' in data) {
            throw new Error(`CEP ${cep} não encontrado.`);
        }

        return data;
    } catch (err: any) {
      const errorDetails = {
        cep,
        url,
        message: err.message,
        statusCode: err.response?.status,
        responseData: err.response?.data,
        timestamp: new Date().toISOString(),
      };
      
      console.error('.: Erro ao consultar ViaCep API:', errorDetails);
      
      throw err;
    }
  }
}
