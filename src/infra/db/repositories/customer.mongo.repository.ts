import { Types } from 'mongoose';
import { BaseRepository } from '../../../base/repositories/base.repository';
import { CustomerModel } from '../models/customer.schema';
import { UpdateProductDTO } from '../../../customer/dtos/customer.dto';
import { Stage } from '../../../customer/enums/stage.enum';

export class CustomerMongoRepository extends BaseRepository<any> {
  constructor() {
    super(CustomerModel as any);
  }

  findByDocument(document: string) {
    return this.model.findOne({ document }).lean();
  }

  findByName(name: string) {
    return this.model
      .find({ name: { $regex: new RegExp(name, 'i') } })
      .lean();
  }

  listByStage(stage: 'LEAD' | 'NEGOCIACAO' | 'VENDIDO', limit = 50, skip = 0) {
    return this.model
      .find({ stage, active: true })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
  }

  searchText(q: string, limit = 50, skip = 0) {
    return this.model
      .find({ $text: { $search: q } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .skip(skip)
      .lean();
  }

  // PRODUTOS
  
  async addProduct(customerId: string, name: string, value: number) {
    const productId = new Types.ObjectId();
    return this.model.findByIdAndUpdate(
      customerId,
      {
        $push: {
          products: {
            _id: productId,
            name,
            value,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );
  }

  async updateProduct(customerId: string, productId: string, data: UpdateProductDTO) {
    const updateFields: any = {};
    if (data.name !== undefined) updateFields['products.$.name'] = data.name;
    if (data.value !== undefined) updateFields['products.$.value'] = data.value;
    if (data.active !== undefined) updateFields['products.$.active'] = data.active;
    
    updateFields['products.$.updatedAt'] = new Date();

    return this.model.findOneAndUpdate(
      { _id: customerId, 'products._id': productId },
      { $set: updateFields },
      { new: true }
    );
  }

  async removeProduct(customerId: string, productId: string) {
    return this.model.findByIdAndUpdate(
      customerId,
      { $pull: { products: { _id: productId } } },
      { new: true }
    );
  }

  // ESTAGIOS

  async changeStage(customerId: string, nextStage: Stage, by?: string, note?: string) {
    const customer = await this.model.findById(customerId);
    if (!customer) return null;

    const now = new Date();
    const historyEntry = {
      from: customer.stage,
      to: nextStage,
      at: now,
      by,
      note,
    };

    return this.model.findByIdAndUpdate(
      customerId,
      {
        $set: {
          stage: nextStage,
          stageChangedAt: now,
        },
        $push: {
          stageHistory: historyEntry,
        },
      },
      { new: true }
    );
  }

  // INATIVAR

  async inactivate(customerId: string) {
    return this.model.findByIdAndUpdate(
      customerId,
      { $set: { active: false } },
      { new: true }
    );
  }
}
