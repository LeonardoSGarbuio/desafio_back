import { Router } from 'express';
import {
  getCourses,
  getCourseByIdHandler,
  createCourseHandler,
  updateCourseHandler,
  deleteCourseHandler,
} from '../controllers/courses.controller';

const router = Router();

router.get('/', getCourses);                    // GET /courses
router.get('/:id', getCourseByIdHandler);       // GET /courses/:id
router.post('/', createCourseHandler);          // POST /courses
router.put('/:id', updateCourseHandler);        // PUT /courses/:id
router.delete('/:id', deleteCourseHandler);     // DELETE /courses/:id

export default router;