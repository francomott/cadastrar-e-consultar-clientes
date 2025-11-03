import { Stage } from '../enums/stage.enum';

export type Person = 'F' | 'J'; // pessoa fisica ou juridica

export interface AddressDTO {
    postalCode: string; // cep
    street: string;     // logradouro
    complement?: string;
    unit?: string;    // numero
    district: string;   // bairro
    city: string;       // cidade
    stateCode: string;  // uf
    state: string;      // estado
    region: string;     // regiao
}

export interface ProductDTO {
    id: string;
    name: string;
    value: number;  
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomerDTO {
    document: string;   // cpf ou cnpj
    person: Person;
    name: string;
    email?: string;
    phone?: string;
    active?: boolean;
    address: AddressDTO;
}

export interface UpdateCustomerDTO {
    name?: string;
    email?: string;
    phone?: string;
    active?: boolean;
    address?: Partial<AddressDTO>;
}

export interface AddProductDTO {
    name: string;
    value: number;
}

export interface UpdateProductDTO {
    name?: string;
    value?: number;
    active?: boolean;
}

export interface ChangeStageDTO {
    nextStage: Stage; // 'LEAD' | 'NEGOCIACAO' | 'VENDIDO'
    by?: string;
    note?: string;
}
