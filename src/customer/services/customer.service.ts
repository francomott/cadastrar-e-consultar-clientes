import { CustomerMongoRepository } from '../../infra/db/repositories/customer.mongo.repository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/customer.dto';
import redisClient from '../../infra/cache/redis.client';
import { validateDocument } from '../../utils/validators/document.validator';
import { CustomerPublisher } from '../events/customer.publisher';

const CACHE_TTL = 300; // 5 minutos

export class CustomerService {
  private readonly repo = new CustomerMongoRepository();
  private readonly publisher = new CustomerPublisher();

  private getCacheKey(id: string) {
    return `customer:${id}`;
  }

  private getDocCacheKey(document: string) {
    return `customer:doc:${document}`;
  }

  private async invalidateCache(id: string, document?: string) {
    const keys = [this.getCacheKey(id)];
    if (document) {
      keys.push(this.getDocCacheKey(document));
    }
    await Promise.all(keys.map(key => redisClient.del(key)));
  }

  async create(input: CreateCustomerDTO) {
    // valida documento (CPF ou CNPJ)
    const documentValidation = validateDocument(input.document, input.person);
    if (!documentValidation.valid) {
      throw new Error(documentValidation.error);
    }

    // nao pode clientes iguais
    const existing = await this.repo.findByDocument(input.document);
    if (existing) {
      throw new Error('Já existe um cliente cadastrado com este documento');
    }

    // validar e-mail
    if (input.email) {
      const existingEmail = await this.repo.findOne({ email: input.email } as any);
      if (existingEmail) {
        throw new Error('Já existe um cliente cadastrado com este email');
      }
    }

    const customer = await this.repo.create({
      document: input.document,
      person: input.person,
      name: input.name,
      email: input.email,
      phone: input.phone,
      active: true,
      address: input.address,
      stage: 'LEAD',
      stageChangedAt: new Date(),
      stageHistory: [],
      products: [],
    });

    // armazena no cache
    const customerId = (customer as any)._id.toString();
    await redisClient.setEx(this.getCacheKey(customerId), CACHE_TTL, JSON.stringify(customer));
    await redisClient.setEx(this.getDocCacheKey(input.document), CACHE_TTL, JSON.stringify(customer));

    // menda a mensagem - evento
    await this.publisher.publishCustomerCreated(customerId, input.address.postalCode);

    return customer;
  }

  async update(id: string, patch: UpdateCustomerDTO) {
    const customer: any = await this.repo.findById(id);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    if (patch.email && patch.email !== customer.email) {
      const existingEmail: any = await this.repo.findOne({ email: patch.email } as any);
      if (existingEmail && existingEmail._id.toString() !== id) {
        throw new Error('Já existe um cliente cadastrado com este email');
      }
    }

    const updated = await this.repo.updateById(id, { $set: patch } as any);

    await this.invalidateCache(id, customer.document);

    return updated;
  }

  async get(id: string) {
    // tenta primeiro no cache
    const cached = await redisClient.get(this.getCacheKey(id));
    if (cached) {
      return JSON.parse(cached);
    }

    const customer = await this.repo.findById(id);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    await redisClient.setEx(this.getCacheKey(id), CACHE_TTL, JSON.stringify(customer));

    return customer;
  }

  async list(limit = 50, skip = 0) {
    return this.repo.findAll({ active: true } as any, limit, skip, { updatedAt: -1 });
  }

  async listByStage(stage: 'LEAD' | 'NEGOCIACAO' | 'VENDIDO', limit = 50, skip = 0) {
    return this.repo.listByStage(stage, limit, skip);
  }

  async search(query: string, limit = 50, skip = 0) {
    return this.repo.searchText(query, limit, skip);
  }

  async inactivate(id: string) {
    const customer: any = await this.repo.findById(id);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    if (!customer.active) {
      throw new Error('Cliente já está inativo');
    }

    const result = await this.repo.inactivate(id);
    
    await this.invalidateCache(id, customer.document);

    return result;
  }

  async delete(id: string) {
    const customer: any = await this.repo.findById(id);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    const result = await this.repo.deleteById(id);
    
    await this.invalidateCache(id, customer.document);

    return result;
  }

  async getByDocument(document: string) {
    const cached = await redisClient.get(this.getDocCacheKey(document));
    if (cached) {
      return JSON.parse(cached);
    }

    const customer = await this.repo.findByDocument(document);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    // cache
    await redisClient.setEx(this.getDocCacheKey(document), CACHE_TTL, JSON.stringify(customer));

    return customer;
  }
}
