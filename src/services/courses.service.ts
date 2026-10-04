import { pool } from '../config/db';

// Lista de cursos 
export async function listCourses() {
  const result = await pool.query(`
    SELECT c.id, c.title, c.category, c.description, c.thumbnail,
           COUNT(m.id)::int AS "modulesCount"
    FROM courses c
    LEFT JOIN modules m ON m.course_id = c.id
    GROUP BY c.id
    ORDER BY c.id
  `);

  return result.rows.map((row) => ({
    id: String(row.id),
    title: row.title,
    category: row.category,
    shortDescription: row.description,
    thumbnail: row.thumbnail,
    modulesCount: row.modulesCount,
  }));
}

// Detalhes do curso 
export async function getCourseById(id: string) {
  const courseResult = await pool.query(
    `SELECT id, title, category, description, thumbnail
     FROM courses WHERE id = $1`,
    [id]
  );

  const course = courseResult.rows[0];
  if (!course) return null;

  const modulesResult = await pool.query(
    `SELECT id, title FROM modules WHERE course_id = $1 ORDER BY position`,
    [course.id]
  );

  const modules = [];
  for (const mod of modulesResult.rows) {
    const lessonsResult = await pool.query(
      `SELECT id, title FROM lessons WHERE module_id = $1 ORDER BY position`,
      [mod.id]
    );
    modules.push({
      id: String(mod.id),
      title: mod.title,
      lessons: lessonsResult.rows.map((l) => ({ id: String(l.id), title: l.title })),
    });
  }

  return {
    id: String(course.id),
    title: course.title,
    category: course.category,
    description: course.description,
    thumbnail: course.thumbnail,
    modules,
  };
}