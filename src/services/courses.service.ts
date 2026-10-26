import { prisma } from '../config/prisma';
import { getCache, setCache, invalidateCache } from './cache.service';

export interface CreateCourseDTO {
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  category?: string | null;
}

export interface UpdateCourseDTO {
  title?: string;
  description?: string | null;
  thumbnail?: string | null;
  category?: string | null;
}

const COURSES_LIST_CACHE_KEY = 'courses:all';

// Lista todos os cursos (com cache)
export async function listCourses() {
  const cached = await getCache<ReturnType<typeof mapCoursesList>>(COURSES_LIST_CACHE_KEY);
  if (cached) return cached;

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

  const result = mapCoursesList(courses);
  await setCache(COURSES_LIST_CACHE_KEY, result);
  return result;
}

function mapCoursesList(
  courses: Array<{
    id: number;
    title: string;
    category: string | null;
    description: string | null;
    thumbnail: string | null;
    _count: { modules: number };
  }>
) {
  return courses.map((course) => ({
    id: String(course.id),
    title: course.title,
    category: course.category,
    shortDescription: course.description,
    thumbnail: course.thumbnail,
    modulesCount: course._count.modules,
  }));
}

// Detalhes de um curso por ID (com cache)
export async function getCourseById(id: number) {
  const cacheKey = `courses:${id}`;
  const cached = await getCache<Record<string, unknown>>(cacheKey);
  if (cached) return cached;

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

  const result = {
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

  await setCache(cacheKey, result);
  return result;
}

// Cria um novo curso e invalida o cache
export async function createCourse(data: CreateCourseDTO) {
  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      category: data.category,
    },
  });

  await invalidateCache();

  return {
    id: String(course.id),
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    category: course.category,
  };
}

// Atualiza um curso existente e invalida o cache
export async function updateCourse(id: number, data: UpdateCourseDTO) {
  const course = await prisma.course.update({
    where: { id },
    data,
  });

  await invalidateCache();

  return {
    id: String(course.id),
    title: course.title,
    description: course.description,
    thumbnail: course.thumbnail,
    category: course.category,
  };
}

// Deleta um curso existente e invalida o cache
export async function deleteCourse(id: number) {
  await prisma.course.delete({
    where: { id },
  });

  await invalidateCache();
}