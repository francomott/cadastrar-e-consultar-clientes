import { Router } from 'express';
import { CustomerController } from './controllers/customer.controller';
import { ProductController } from './controllers/product.controller';
import { StageController } from './controllers/stage.controller';

const router = Router();

// instacia controllers
const customerCtrl = new CustomerController();
const productCtrl = new ProductController();
const stageCtrl = new StageController();

// rota de clientes

// Criar cliente
router.post('/', customerCtrl.create);

// Listar todos os clientes ativos
router.get('/', customerCtrl.list);

// Buscar por texto (nome ou email)
router.get('/search', customerCtrl.search);

// Listar clientes por estágio
router.get('/stage/:stage', customerCtrl.listByStage);

// Buscar cliente por documento
router.get('/document/:document', customerCtrl.getByDocument);

// Buscar cliente por ID
router.get('/:id', customerCtrl.get);

// Atualizar cliente
router.patch('/:id', customerCtrl.update);

// Inativar cliente
router.patch('/:id/inactivate', customerCtrl.inactivate);

// Excluir cliente
router.delete('/:id', customerCtrl.delete);

// rotas produtos

// Listar produtos de um cliente
router.get('/:customerId/products', productCtrl.list);

// Adicionar produto ao cliente
router.post('/:customerId/products', productCtrl.add);

// Atualizar produto do cliente
router.patch('/:customerId/products/:productId', productCtrl.update);

// Remover produto do cliente
router.delete('/:customerId/products/:productId', productCtrl.remove);

// rotas estagios

// Obter estágio atual do cliente
router.get('/:customerId/stage', stageCtrl.getCurrent);

// Obter histórico de mudanças de estágio
router.get('/:customerId/stage/history', stageCtrl.getHistory);

// Alterar estágio do cliente
router.post('/:customerId/stage', stageCtrl.change);

export default router;

