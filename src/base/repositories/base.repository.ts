import { FilterQuery, Model, UpdateQuery } from 'mongoose';

export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(doc: Partial<T>) {
    return this.model.create(doc);
  }

  async findById(id: string) {
    return this.model.findById(id).lean();
  }

  async findOne(filter: FilterQuery<T>) {
    return this.model.findOne(filter).lean();
  }

  async findAll(filter: FilterQuery<T>, limit = 50, skip = 0, sort: any = { updatedAt: -1 }) {
    return this.model.find(filter).limit(limit).skip(skip).sort(sort).lean();
  }

  async updateById(id: string, update: UpdateQuery<T>) {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteById(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
