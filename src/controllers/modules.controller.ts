import { Request, Response } from 'express';
import {
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  courseExists,
} from '../services/modules.service';

export async function getModuleByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const moduleId = Number(id);

    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      res.status(400).json({ message: 'ID de módulo inválido.' });
      return;
    }

    const module = await getModuleById(moduleId);

    if (!module) {
      res.status(404).json({ message: 'Módulo não encontrado' });
      return;
    }

    res.json(module);
  } catch (error) {
    console.error('Erro ao buscar módulo:', error);
    res.status(500).json({ message: 'Erro interno ao buscar módulo' });
  }
}

export async function createModuleHandler(req: Request, res: Response) {
  try {
    const { courseId, title, position, order } = req.body;

    const courseIdNum = Number(courseId);
    if (!Number.isInteger(courseIdNum) || courseIdNum <= 0) {
      res.status(400).json({ message: 'courseId inválido ou ausente.' });
      return;
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ message: 'O título do módulo é obrigatório.' });
      return;
    }

    // Aceita tanto "position" quanto "order" no payload
    const posNum = Number(position !== undefined ? position : order);
    if (!Number.isInteger(posNum) || posNum <= 0) {
      res.status(400).json({ message: 'A ordem/posição do módulo deve ser um número inteiro positivo.' });
      return;
    }

    // Valida se o curso pai realmente existe antes de criar
    const parentCourseExists = await courseExists(courseIdNum);
    if (!parentCourseExists) {
      res.status(404).json({ message: 'Curso associado não foi encontrado.' });
      return;
    }

    const newModule = await createModule({
      courseId: courseIdNum,
      title: title.trim(),
      position: posNum,
    });

    res.status(201).json(newModule);
  } catch (error) {
    console.error('Erro ao criar módulo:', error);
    res.status(500).json({ message: 'Erro interno ao criar módulo' });
  }
}

export async function updateModuleHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const moduleId = Number(id);

    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      res.status(400).json({ message: 'ID de módulo inválido.' });
      return;
    }

    const existingModule = await getModuleById(moduleId);
    if (!existingModule) {
      res.status(404).json({ message: 'Módulo não encontrado' });
      return;
    }

    const { courseId, title, position, order } = req.body;

    let courseIdNum: number | undefined;
    if (courseId !== undefined) {
      courseIdNum = Number(courseId);
      if (!Number.isInteger(courseIdNum) || courseIdNum <= 0) {
        res.status(400).json({ message: 'courseId inválido.' });
        return;
      }
      const parentExists = await courseExists(courseIdNum);
      if (!parentExists) {
        res.status(404).json({ message: 'Curso associado não foi encontrado.' });
        return;
      }
    }

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      res.status(400).json({ message: 'O título do módulo não pode ser vazio.' });
      return;
    }

    let posNum: number | undefined;
    const rawPos = position !== undefined ? position : order;
    if (rawPos !== undefined) {
      posNum = Number(rawPos);
      if (!Number.isInteger(posNum) || posNum <= 0) {
        res.status(400).json({ message: 'A ordem/posição do módulo deve ser um número inteiro positivo.' });
        return;
      }
    }

    const updated = await updateModule(moduleId, {
      courseId: courseIdNum,
      title: title !== undefined ? title.trim() : undefined,
      position: posNum,
    });

    res.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar módulo:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar módulo' });
  }
}

export async function deleteModuleHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const moduleId = Number(id);

    if (!Number.isInteger(moduleId) || moduleId <= 0) {
      res.status(400).json({ message: 'ID de módulo inválido.' });
      return;
    }

    const existingModule = await getModuleById(moduleId);
    if (!existingModule) {
      res.status(404).json({ message: 'Módulo não encontrado' });
      return;
    }

    await deleteModule(moduleId);
    res.status(200).json({ message: 'Módulo removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar módulo:', error);
    res.status(500).json({ message: 'Erro interno ao deletar módulo' });
  }
}