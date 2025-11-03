import { CustomerMongoRepository } from '../../infra/db/repositories/customer.mongo.repository';
import { AddProductDTO, UpdateProductDTO } from '../dtos/customer.dto';

export class ProductService {
  private readonly repo = new CustomerMongoRepository();

  async list(customerId: string) {
    const customer: any = await this.repo.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    return customer.products || [];
  }

  async add(customerId: string, dto: AddProductDTO) {
    const customer: any = await this.repo.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    return this.repo.addProduct(customerId, dto.name, dto.value);
  }

  async update(customerId: string, productId: string, dto: UpdateProductDTO) {
    const customer: any = await this.repo.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    const product = customer.products?.find((p: any) => p._id.toString() === productId);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return this.repo.updateProduct(customerId, productId, dto);
  }

  async remove(customerId: string, productId: string) {
    const customer: any = await this.repo.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    const product = customer.products?.find((p: any) => p._id.toString() === productId);
    if (!product) {
      throw new Error('Produto não encontrado');
    }

    return this.repo.removeProduct(customerId, productId);
  }
}

