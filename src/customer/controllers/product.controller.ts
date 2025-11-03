import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { AddProductDTO, UpdateProductDTO } from '../dtos/customer.dto';

export class ProductController {
  private readonly service = new ProductService();

  list = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const products = await this.service.list(customerId);
      return res.json(products);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  add = async (req: Request, res: Response) => {
    try {
      const { customerId } = req.params;
      const dto: AddProductDTO = req.body;

      // Validações básicas
      if (!dto.name || dto.value === undefined) {
        return res.status(400).json({ 
          message: 'Campos obrigatórios: name, value' 
        });
      }

      if (typeof dto.value !== 'number' || dto.value < 0) {
        return res.status(400).json({ 
          message: 'O valor do produto deve ser um número positivo' 
        });
      }

      const customer = await this.service.add(customerId, dto);
      return res.status(201).json(customer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { customerId, productId } = req.params;
      const dto: UpdateProductDTO = req.body;

      // Validar valor se fornecido
      if (dto.value !== undefined && (typeof dto.value !== 'number' || dto.value < 0)) {
        return res.status(400).json({ 
          message: 'O valor do produto deve ser um número positivo' 
        });
      }

      const customer = await this.service.update(customerId, productId, dto);
      return res.json(customer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };

  remove = async (req: Request, res: Response) => {
    try {
      const { customerId, productId } = req.params;
      const customer = await this.service.remove(customerId, productId);
      return res.json(customer);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  };
}

