import { Router } from 'express';
import {
  getModuleByIdHandler,
  createModuleHandler,
  updateModuleHandler,
  deleteModuleHandler,
} from '../controllers/modules.controller';

const router = Router();

router.get('/:id', getModuleByIdHandler);       // GET /modules/:id
router.post('/', createModuleHandler);          // POST /modules
router.put('/:id', updateModuleHandler);        // PUT /modules/:id
router.delete('/:id', deleteModuleHandler);     // DELETE /modules/:id

export default router;