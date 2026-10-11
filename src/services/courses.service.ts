import { prisma } from '../config/prisma';

// Lista de cursos 
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

// Detalhes do curso 
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