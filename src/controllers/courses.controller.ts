import { Request, Response } from 'express';
import {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../services/courses.service';

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

export async function createCourseHandler(req: Request, res: Response) {
  try {
    const { title, description, thumbnail, category } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ message: 'O título do curso é obrigatório.' });
      return;
    }

    const course = await createCourse({
      title: title.trim(),
      description: description ? String(description) : undefined,
      thumbnail: thumbnail ? String(thumbnail) : undefined,
      category: category ? String(category) : undefined,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ message: 'Erro interno ao criar curso' });
  }
}

export async function updateCourseHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const courseId = Number(id);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      res.status(400).json({ message: 'ID de curso inválido.' });
      return;
    }

    const existingCourse = await getCourseById(courseId);
    if (!existingCourse) {
      res.status(404).json({ message: 'Curso não encontrado' });
      return;
    }

    const { title, description, thumbnail, category } = req.body;

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      res.status(400).json({ message: 'O título do curso não pode ser vazio.' });
      return;
    }

    const updatedCourse = await updateCourse(courseId, {
      title: title !== undefined ? title.trim() : undefined,
      description: description !== undefined ? String(description) : undefined,
      thumbnail: thumbnail !== undefined ? String(thumbnail) : undefined,
      category: category !== undefined ? String(category) : undefined,
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar curso' });
  }
}

export async function deleteCourseHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const courseId = Number(id);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      res.status(400).json({ message: 'ID de curso inválido.' });
      return;
    }

    const existingCourse = await getCourseById(courseId);
    if (!existingCourse) {
      res.status(404).json({ message: 'Curso não encontrado' });
      return;
    }

    await deleteCourse(courseId);
    res.status(200).json({ message: 'Curso removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    res.status(500).json({ message: 'Erro interno ao deletar curso' });
  }
}