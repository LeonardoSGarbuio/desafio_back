import { Router } from 'express';
import { getCourses, getCourseByIdHandler } from '../controllers/courses.controller';

const router = Router();

router.get('/', getCourses);               // GET /courses
router.get('/:id', getCourseByIdHandler);  // GET /courses/:id

export default router;