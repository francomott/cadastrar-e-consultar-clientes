import { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/customer.dto';

export class CustomerController {
  private readonly service = new CustomerService();

  create = async (req: Request, res: Response) => {
    try {
      const dto: CreateCustomerDTO = req.body;
      
      // Validações básicas
      if (!dto.document || !dto.person || !dto.name || !dto.email || !dto.phone) {
        return res.status(400).json({ 
          message: 'Campos obrigatórios: document, person, name, email, phone' 
        });
      }

      if (!['F', 'J'].includes(dto.person)) {
        return res.status(400).json({ 
          message: 'O campo person deve ser F (Pessoa Física) ou J (Pessoa Jurídica)' 
        });
      }

      if (!dto.address) {
        return res.status(400).json({ 
          message: 'O campo address é obrigatório' 
        });
      }

      const customer = await this.service.create(dto);
      return res.status(201).json(customer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dto: UpdateCustomerDTO = req.body;

      const customer = await this.service.update(id, dto);
      return res.json(customer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customer = await this.service.get(id);
      return res.json(customer);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const skip = req.query.skip ? Number(req.query.skip) : 0;

      const customers = await this.service.list(limit, skip);
      return res.json(customers);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  listByStage = async (req: Request, res: Response) => {
    try {
      const { stage } = req.params;
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const skip = req.query.skip ? Number(req.query.skip) : 0;

      if (!['LEAD', 'NEGOCIACAO', 'VENDIDO'].includes(stage)) {
        return res.status(400).json({ 
          message: 'Estágio inválido. Use: LEAD, NEGOCIACAO ou VENDIDO' 
        });
      }

      const customers = await this.service.listByStage(
        stage as 'LEAD' | 'NEGOCIACAO' | 'VENDIDO',
        limit,
        skip
      );
      return res.json(customers);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  search = async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'O parâmetro q é obrigatório' });
      }

      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const skip = req.query.skip ? Number(req.query.skip) : 0;

      const customers = await this.service.search(q, limit, skip);
      return res.json(customers);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  getByDocument = async (req: Request, res: Response) => {
    try {
      const { document } = req.params;
      const customer = await this.service.getByDocument(document);
      return res.json(customer);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  };

  inactivate = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customer = await this.service.inactivate(id);
      return res.json(customer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };
}

