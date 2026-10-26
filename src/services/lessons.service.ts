import { prisma } from '../config/prisma';
import { getCache, setCache, invalidateCache } from './cache.service';

export interface CreateLessonDTO {
  moduleId: number;
  title: string;
  description?: string;
  duration: number;
  position: number;
}

export interface UpdateLessonDTO {
  title?: string;
  description?: string;
  duration?: number;
  position?: number;
  moduleId?: number;
}

// Verifica se um módulo pai existe pelo ID
export async function moduleExists(moduleId: number): Promise<boolean> {
  const count = await prisma.module.count({ where: { id: moduleId } });
  return count > 0;
}

// Busca aula por ID (com cache)
export async function getLessonById(id: number) {
  const cacheKey = `lessons:${id}`;
  const cached = await getCache<Record<string, unknown>>(cacheKey);
  if (cached) return cached;

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    select: {
      id: true,
      module_id: true,
      title: true,
      description: true,
      duration: true,
      position: true,
    },
  });

  if (!lesson) return null;

  const result = {
    id: String(lesson.id),
    moduleId: String(lesson.module_id),
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    order: lesson.position,
  };

  await setCache(cacheKey, result);
  return result;
}

// Cria uma nova aula e invalida o cache
export async function createLesson(data: CreateLessonDTO) {
  const lesson = await prisma.lesson.create({
    data: {
      module_id: data.moduleId,
      title: data.title,
      description: data.description,
      duration: data.duration,
      position: data.position,
    },
  });

  await invalidateCache();

  return {
    id: String(lesson.id),
    moduleId: String(lesson.module_id),
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    order: lesson.position,
  };
}

// Atualiza uma aula existente e invalida o cache
export async function updateLesson(id: number, data: UpdateLessonDTO) {
  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      duration: data.duration,
      position: data.position,
      module_id: data.moduleId,
    },
  });

  await invalidateCache();

  return {
    id: String(lesson.id),
    moduleId: String(lesson.module_id),
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    order: lesson.position,
  };
}

// Deleta uma aula existente e invalida o cache
export async function deleteLesson(id: number) {
  await prisma.lesson.delete({
    where: { id },
  });

  await invalidateCache();
}