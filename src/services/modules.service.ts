import { prisma } from '../config/prisma';

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

// Busca módulo por ID incluindo suas aulas ordenadas
export async function getModuleById(id: number) {
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

  return {
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
}

// Cria um novo módulo
export async function createModule(data: CreateModuleDTO) {
  const module = await prisma.module.create({
    data: {
      course_id: data.courseId,
      title: data.title,
      position: data.position,
    },
  });

  return {
    id: String(module.id),
    courseId: String(module.course_id),
    title: module.title,
    order: module.position,
  };
}

// Atualiza um módulo existente
export async function updateModule(id: number, data: UpdateModuleDTO) {
  const module = await prisma.module.update({
    where: { id },
    data: {
      title: data.title,
      position: data.position,
      course_id: data.courseId,
    },
  });

  return {
    id: String(module.id),
    courseId: String(module.course_id),
    title: module.title,
    order: module.position,
  };
}

// Deleta um módulo existente
export async function deleteModule(id: number) {
  await prisma.module.delete({
    where: { id },
  });
}