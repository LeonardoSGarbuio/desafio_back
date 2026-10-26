import { prisma } from '../config/prisma';
import { getCache, setCache, invalidateCache } from './cache.service';

export interface CreateModuleDTO {
  courseId: number;
  title: string;
  position: number;
}

export interface UpdateModuleDTO {
  title?: string;
  position?: number;
  courseId?: number;
}

// Verifica se um curso existe pelo ID
export async function courseExists(courseId: number): Promise<boolean> {
  const count = await prisma.course.count({ where: { id: courseId } });
  return count > 0;
}

// Busca módulo por ID incluindo suas aulas ordenadas (com cache)
export async function getModuleById(id: number) {
  const cacheKey = `modules:${id}`;
  const cached = await getCache<Record<string, unknown>>(cacheKey);
  if (cached) return cached;

  const module = await prisma.module.findUnique({
    where: { id },
    select: {
      id: true,
      course_id: true,
      title: true,
      position: true,
      lessons: {
        orderBy: { position: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          duration: true,
          position: true,
        },
      },
    },
  });

  if (!module) return null;

  const result = {
    id: String(module.id),
    courseId: String(module.course_id),
    title: module.title,
    order: module.position,
    lessons: module.lessons.map((lesson) => ({
      id: String(lesson.id),
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      order: lesson.position,
    })),
  };

  await setCache(cacheKey, result);
  return result;
}

// Cria um novo módulo e invalida o cache
export async function createModule(data: CreateModuleDTO) {
  const module = await prisma.module.create({
    data: {
      course_id: data.courseId,
      title: data.title,
      position: data.position,
    },
  });

  await invalidateCache();

  return {
    id: String(module.id),
    courseId: String(module.course_id),
    title: module.title,
    order: module.position,
  };
}

// Atualiza um módulo existente e invalida o cache
export async function updateModule(id: number, data: UpdateModuleDTO) {
  const module = await prisma.module.update({
    where: { id },
    data: {
      title: data.title,
      position: data.position,
      course_id: data.courseId,
    },
  });

  await invalidateCache();

  return {
    id: String(module.id),
    courseId: String(module.course_id),
    title: module.title,
    order: module.position,
  };
}

// Deleta um módulo existente e invalida o cache
export async function deleteModule(id: number) {
  await prisma.module.delete({
    where: { id },
  });

  await invalidateCache();
}