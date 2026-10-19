import { Request, Response } from 'express';
import {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../services/courses.service';
import { uploadCourseThumbnail } from '../services/storage.service';

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

    // Se enviou um arquivo de imagem, faz upload no Supabase; senão, usa a URL em string (se enviada)
    let thumbnailUrl: string | undefined = thumbnail ? String(thumbnail) : undefined;
    if (req.file) {
      thumbnailUrl = await uploadCourseThumbnail(req.file);
    }

    const course = await createCourse({
      title: title.trim(),
      description: description ? String(description) : undefined,
      thumbnail: thumbnailUrl,
      category: category ? String(category) : undefined,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    const message = error instanceof Error ? error.message : 'Erro interno ao criar curso';
    res.status(500).json({ message });
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

    // Se enviou um arquivo de imagem novo, faz upload no Supabase; senão, usa a string (se enviada)
    let thumbnailUrl: string | undefined =
      thumbnail !== undefined ? String(thumbnail) : undefined;
    if (req.file) {
      thumbnailUrl = await uploadCourseThumbnail(req.file);
    }

    const updatedCourse = await updateCourse(courseId, {
      title: title !== undefined ? title.trim() : undefined,
      description: description !== undefined ? String(description) : undefined,
      thumbnail: thumbnailUrl,
      category: category !== undefined ? String(category) : undefined,
    });

    res.json(updatedCourse);
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    const message = error instanceof Error ? error.message : 'Erro interno ao atualizar curso';
    res.status(500).json({ message });
  }
}

export async function updateCourseThumbnailHandler(req: Request, res: Response) {
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

    if (!req.file) {
      res.status(400).json({ message: 'Nenhum arquivo de imagem foi enviado no campo thumbnail.' });
      return;
    }

    const thumbnailUrl = await uploadCourseThumbnail(req.file);
    const updatedCourse = await updateCourse(courseId, { thumbnail: thumbnailUrl });

    res.json(updatedCourse);
  } catch (error) {
    console.error('Erro ao atualizar imagem do curso:', error);
    const message = error instanceof Error ? error.message : 'Erro interno ao atualizar imagem do curso';
    res.status(500).json({ message });
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