import { prisma } from '../config/prisma';

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

// Busca aula por ID
export async function getLessonById(id: number) {
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

  return {
    id: String(lesson.id),
    moduleId: String(lesson.module_id),
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    order: lesson.position,
  };
}

// Cria uma nova aula
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

  return {
    id: String(lesson.id),
    moduleId: String(lesson.module_id),
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    order: lesson.position,
  };
}

// Atualiza uma aula existente
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

  return {
    id: String(lesson.id),
    moduleId: String(lesson.module_id),
    title: lesson.title,
    description: lesson.description,
    duration: lesson.duration,
    order: lesson.position,
  };
}

// Deleta uma aula existente
export async function deleteLesson(id: number) {
  await prisma.lesson.delete({
    where: { id },
  });
}