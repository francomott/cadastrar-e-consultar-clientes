import { CustomerMongoRepository } from '../../infra/db/repositories/customer.mongo.repository';
import { ChangeStageDTO } from '../dtos/customer.dto';
import { Stage, StageEnum } from '../enums/stage.enum';

export class StageService {
  private readonly repo = new CustomerMongoRepository();

  async change(customerId: string, dto: ChangeStageDTO) {
    const customer: any = await this.repo.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    // validar se o estagio e valido
    if (!StageEnum.includes(dto.nextStage)) {
      throw new Error(`Estágio inválido. Use: ${StageEnum.join(', ')}`);
    }

    // nao permitir mudanca para o mesmo estagio
    if (customer.stage === dto.nextStage) {
      throw new Error('O cliente já está neste estágio');
    }

    return this.repo.changeStage(customerId, dto.nextStage, dto.by, dto.note);
  }

  async getHistory(customerId: string) {
    const customer: any = await this.repo.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    return customer.stageHistory || [];
  }

  async getCurrentStage(customerId: string) {
    const customer: any = await this.repo.findById(customerId);
    if (!customer) {
      throw new Error('Cliente não encontrado');
    }

    return {
      stage: customer.stage,
      changedAt: customer.stageChangedAt,
    };
  }
}

