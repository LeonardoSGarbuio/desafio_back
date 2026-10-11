import { Router } from 'express';
import {
  getLessonByIdHandler,
  createLessonHandler,
  updateLessonHandler,
  deleteLessonHandler,
} from '../controllers/lessons.controller';

const router = Router();

router.get('/:id', getLessonByIdHandler);       // GET /lessons/:id
router.post('/', createLessonHandler);          // POST /lessons
router.put('/:id', updateLessonHandler);        // PUT /lessons/:id
router.delete('/:id', deleteLessonHandler);     // DELETE /lessons/:id

export default router;