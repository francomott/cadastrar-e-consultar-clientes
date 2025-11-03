import { Schema, model, Types } from 'mongoose';
import { StageEnum } from '../../../customer/enums/stage.enum';

const AddressSchema = new Schema(
  {
    postalCode: { type: String, trim: true },
    street:     { type: String, trim: true },
    complement: { type: String, trim: false },
    unit:       { type: String, trim: false },
    district:   { type: String, trim: true },
    city:       { type: String, trim: true },
    stateCode:  { type: String, trim: true, maxlength: 2 },
    state:      { type: String, trim: true },
    region:     { type: String, trim: true },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    _id:   { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
    name:  { type: String, required: true, trim: true, maxlength: 120 },
    value: { type: Number, required: true },
    active:{ type: Boolean, default: true },
  },
  { _id: false, timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const StageHistorySchema = new Schema(
  {
    from: { type: String, enum: StageEnum, required: true },
    to:   { type: String, enum: StageEnum, required: true },
    at:   { type: Date,   required: true, default: () => new Date() },
    by:   { type: String },
    note: { type: String, maxlength: 1000 },
  },
  { _id: false }
);

const CustomerSchema = new Schema(
  {
    document: { type: String, required: true, trim: true },
    person:   { type: String, enum: ['F', 'J'], required: true },

    name:   { type: String, required: true, trim: true, maxlength: 160 },
    email:  { type: String, required: true, trim: true, lowercase: true },
    phone:  { type: String, required: true, trim: true },
    active: { type: Boolean, default: true },

    address: { type: AddressSchema, required: true },

    stage:          { type: String, enum: StageEnum, default: 'LEAD', index: true },
    stageChangedAt: { type: Date },
    stageHistory:   { type: [StageHistorySchema], default: [] },

    products: { type: [ProductSchema], default: [] },
  },
  { timestamps: true, collection: 'customers' }
);

/** Índices */
CustomerSchema.index({ document: 1 }, { unique: true });

CustomerSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: 'string' } } }
);

CustomerSchema.index({ name: 'text', email: 'text' });
CustomerSchema.index({ stage: 1, active: 1 });

CustomerSchema.index(
  { 'products.name': 1 },
  { partialFilterExpression: { 'products.active': true } }
);

export const CustomerModel = model('Customer', CustomerSchema);
