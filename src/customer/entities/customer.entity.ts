import { BaseEntity } from '../../base/entities/base.entity';

export class CustomerEntity extends BaseEntity {
  document!: string;
  person!: 'F' | 'J';
  name!: string;
  email?: string;
  phone?: string;
  active!: boolean;

  address!: {
    postalCode: string;
    street: string;
    complement?: string;
    unit?: string;
    district: string;
    city: string;
    stateCode: string;
    state: string;
    region: string;
  };

  stage!: 'LEAD' | 'NEGOCIACAO' | 'VENDIDO';
  stageChangedAt?: Date;
  stageHistory!: Array<{
    from: 'LEAD' | 'NEGOCIACAO' | 'VENDIDO';
    to: 'LEAD' | 'NEGOCIACAO' | 'VENDIDO';
    at: Date;
    by?: string;
    note?: string;
  }>;

  products!: Array<{
    _id: string;
    name: string;
    value: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
