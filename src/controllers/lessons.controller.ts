import { Request, Response } from 'express';
import {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  moduleExists,
} from '../services/lessons.service';

export async function getLessonByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const lessonId = Number(id);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      res.status(400).json({ message: 'ID de aula inválido.' });
      return;
    }

    const lesson = await getLessonById(lessonId);

    if (!lesson) {
      res.status(404).json({ message: 'Aula não encontrada' });
      return;
    }

    res.json(lesson);
  } catch (error) {
    console.error('Erro ao buscar aula:', error);
    res.status(500).json({ message: 'Erro interno ao buscar aula' });
  }
}

export async function createLessonHandler(req: Request, res: Response) {
  try {
    const { moduleId, title, description, duration, position, order } = req.body;

    const moduleIdNum = Number(moduleId);
    if (!Number.isInteger(moduleIdNum) || moduleIdNum <= 0) {
      res.status(400).json({ message: 'moduleId inválido ou ausente.' });
      return;
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ message: 'O título da aula é obrigatório.' });
      return;
    }

    const durationNum = Number(duration);
    if (!Number.isInteger(durationNum) || durationNum <= 0) {
      res.status(400).json({ message: 'A duração da aula deve ser um número inteiro positivo (em minutos).' });
      return;
    }

    const posNum = Number(position !== undefined ? position : order);
    if (!Number.isInteger(posNum) || posNum <= 0) {
      res.status(400).json({ message: 'A ordem/posição da aula deve ser um número inteiro positivo.' });
      return;
    }

    // Valida se o módulo pai existe antes de criar
    const parentModuleExists = await moduleExists(moduleIdNum);
    if (!parentModuleExists) {
      res.status(404).json({ message: 'Módulo associado não foi encontrado.' });
      return;
    }

    const newLesson = await createLesson({
      moduleId: moduleIdNum,
      title: title.trim(),
      description: description ? String(description) : undefined,
      duration: durationNum,
      position: posNum,
    });

    res.status(201).json(newLesson);
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ message: 'Erro interno ao criar aula' });
  }
}

export async function updateLessonHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const lessonId = Number(id);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      res.status(400).json({ message: 'ID de aula inválido.' });
      return;
    }

    const existingLesson = await getLessonById(lessonId);
    if (!existingLesson) {
      res.status(404).json({ message: 'Aula não encontrada' });
      return;
    }

    const { moduleId, title, description, duration, position, order } = req.body;

    let moduleIdNum: number | undefined;
    if (moduleId !== undefined) {
      moduleIdNum = Number(moduleId);
      if (!Number.isInteger(moduleIdNum) || moduleIdNum <= 0) {
        res.status(400).json({ message: 'moduleId inválido.' });
        return;
      }
      const parentExists = await moduleExists(moduleIdNum);
      if (!parentExists) {
        res.status(404).json({ message: 'Módulo associado não foi encontrado.' });
        return;
      }
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      res.status(400).json({ message: 'O título da aula não pode ser vazio.' });
      return;
    }

    let durationNum: number | undefined;
    if (duration !== undefined) {
      durationNum = Number(duration);
      if (!Number.isInteger(durationNum) || durationNum <= 0) {
        res.status(400).json({ message: 'A duração da aula deve ser um número inteiro positivo (em minutos).' });
        return;
      }
    }

    let posNum: number | undefined;
    const rawPos = position !== undefined ? position : order;
    if (rawPos !== undefined) {
      posNum = Number(rawPos);
      if (!Number.isInteger(posNum) || posNum <= 0) {
        res.status(400).json({ message: 'A ordem/posição da aula deve ser um número inteiro positivo.' });
        return;
      }
    }

    const updated = await updateLesson(lessonId, {
      moduleId: moduleIdNum,
      title: title !== undefined ? title.trim() : undefined,
      description: description !== undefined ? String(description) : undefined,
      duration: durationNum,
      position: posNum,
    });

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar aula' });
  }
}

export async function deleteLessonHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const lessonId = Number(id);

    if (!Number.isInteger(lessonId) || lessonId <= 0) {
      res.status(400).json({ message: 'ID de aula inválido.' });
      return;
    }

    const existingLesson = await getLessonById(lessonId);
    if (!existingLesson) {
      res.status(404).json({ message: 'Aula não encontrada' });
      return;
    }

    await deleteLesson(lessonId);
    res.status(200).json({ message: 'Aula removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar aula:', error);
    res.status(500).json({ message: 'Erro interno ao deletar aula' });
  }
}