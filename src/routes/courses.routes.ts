import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import {
  getCourses,
  getCourseByIdHandler,
  createCourseHandler,
  updateCourseHandler,
  updateCourseThumbnailHandler,
  deleteCourseHandler,
} from '../controllers/courses.controller';
import { uploadThumbnail } from '../config/upload';

const router = Router();

// Middleware que processa o upload do campo 'thumbnail' e trata erros de formato/tamanho com 400
function handleThumbnailUpload(req: Request, res: Response, next: NextFunction) {
  const upload = uploadThumbnail.single('thumbnail');
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: 'A imagem excede o tamanho máximo permitido de 5MB.' });
        return;
      }
      res.status(400).json({ message: `Erro no upload: ${err.message}` });
      return;
    }
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    next();
  });
}

router.get('/', getCourses);                                                 // GET /courses
router.get('/:id', getCourseByIdHandler);                                    // GET /courses/:id
router.post('/', handleThumbnailUpload, createCourseHandler);                // POST /courses (JSON ou multipart/form-data)
router.put('/:id', handleThumbnailUpload, updateCourseHandler);              // PUT /courses/:id (JSON ou multipart/form-data)
router.patch('/:id/thumbnail', handleThumbnailUpload, updateCourseThumbnailHandler); // PATCH /courses/:id/thumbnail
router.delete('/:id', deleteCourseHandler);                                  // DELETE /courses/:id

export default router;