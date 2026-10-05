import { Request, Response } from 'express';
import { listCourses, getCourseById } from '../services/courses.service';

export async function getCourses(req: Request, res: Response) {
  try {
    const courses = await listCourses();
    res.json(courses);
  } catch (error) {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({ message: 'Erro interno ao buscar cursos' });
  }
}

export async function getCourseByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validação da entrada
    const courseId = Number(id);
    if (!Number.isInteger(courseId) || courseId <= 0) {
      res.status(400).json({ message: 'ID de curso inválido.' });
      return;
    }

    const course = await getCourseById(courseId);

    if (!course) {
      res.status(404).json({ message: 'Curso não encontrado' });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    res.status(500).json({ message: 'Erro interno ao buscar curso' });
  }
}