import { Request, Response } from 'express';
import { StageService } from '../services/stage.service';
import { ChangeStageDTO } from '../dtos/customer.dto';
import { StageEnum } from '../enums/stage.enum';

export class StageController {
  private readonly service = new StageService();

  change = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const dto: ChangeStageDTO = req.body;

      // Validações básicas
      if (!dto.nextStage) {
        return res.status(400).json({ 
          message: 'O campo nextStage é obrigatório' 
        });
      }

      if (!StageEnum.includes(dto.nextStage)) {
        return res.status(400).json({ 
          message: `Estágio inválido. Use: ${StageEnum.join(', ')}` 
        });
      }

      const customer = await this.service.change(customerId, dto);
      return res.json(customer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  getHistory = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const history = await this.service.getHistory(customerId);
      return res.json(history);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  getCurrent = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const stage = await this.service.getCurrentStage(customerId);
      return res.json(stage);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };
}

