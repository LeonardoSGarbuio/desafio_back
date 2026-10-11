import { prisma } from '../config/prisma';

export interface CreateCourseDTO {
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
}

export interface UpdateCourseDTO {
  title?: string;
  description?: string;
  thumbnail?: string;
  category?: string;
}

// Lista todos os cursos
export async function listCourses() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      thumbnail: true,
      _count: { select: { modules: true } },
    },
    orderBy: { id: 'asc' },
  });

  return courses.map((course) => ({
    id: String(course.id),
    title: course.title,
    category: course.category,
    shortDescription: course.description,
    thumbnail: course.thumbnail,
    modulesCount: course._count.modules,
  }));
}

// Detalhes de um curso por ID (com módulos e aulas ordenados)
export async function getCourseById(id: number) {
  const course = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      thumbnail: true,
      modules: {
        orderBy: { position: 'asc' },
        select: {
          id: true,
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
      },
    },
  });

  if (!course) return null;

  return {
    id: String(course.id),
    title: course.title,
    category: course.category,
    description: course.description,
    thumbnail: course.thumbnail,
    modules: course.modules.map((mod) => ({
      id: String(mod.id),
      title: mod.title,
      order: mod.position,
      lessons: mod.lessons.map((lesson) => ({
        id: String(lesson.id),
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        order: lesson.position,
      })),
    })),
  };
}

// Cria um novo curso
export async function createCourse(data: CreateCourseDTO) {
  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      category: data.category,
    },
  });

  return {
    id: String(course.id),
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    category: course.category,
  };
}

// Atualiza um curso existente
export async function updateCourse(id: number, data: UpdateCourseDTO) {
  const course = await prisma.course.update({
    where: { id },
    data,
  });

  return {
    id: String(course.id),
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    category: course.category,
  };
}

// Deleta um curso existente
export async function deleteCourse(id: number) {
  await prisma.course.delete({
    where: { id },
  });
}