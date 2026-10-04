import 'dotenv/config'; 
import pg from 'pg';

const { Client } = pg;

async function seed() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Conectado ao banco!');

    // Trava para não haver duplicação
    const check = await client.query('SELECT COUNT(*) FROM courses');
    const total = Number(check.rows[0].count);

    if (total > 0) {
      console.log(`Já existem ${total} cursos no banco. Insert ignorado.`);
      return;
    }

    // CURSO 1
    const course1 = await client.query(
      `INSERT INTO courses (title, description, thumbnail, category)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['Desenvolvimento Web Fullstack', 'Introdução prática ao desenvolvimento web, do front ao back.', 'https://exemplo.com/fullstack.jpg', 'Programação']
    );
    const c1 = course1.rows[0].id;
    console.log(`Curso 1 (Desenvolvimento Web Fullstack) criado com id ${c1}`);

    // Modulo 1 Curso 1
    const mod1 = await client.query(
      `INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id`,
      [c1, 'Fundamentos', 1]
    );
    const m1 = mod1.rows[0].id;

    // Modulo 2 Curso 1
    const mod2 = await client.query(
      `INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id`,
      [c1, 'Backend', 2]
    );
    const m2 = mod2.rows[0].id;

    // Aulas curso 1
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m1, 'Introdução à Web', 'Como a internet funciona.', 15, 1]
    );
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m1, 'HTML e CSS', 'Estrutura e estilo de páginas.', 20, 2]
    );
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m1, 'JavaScript básico', 'Fundamentos de JavaScript para páginas.', 25, 3]
    );

    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m2, 'Node.js', 'Rodando JavaScript no servidor.', 30, 1]
    );
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m2, 'APIs REST', 'Como criar e consumir endpoints.', 35, 2]
    );

    // CURSO 2 
    const course2 = await client.query(
      `INSERT INTO courses (title, description, thumbnail, category)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['Banco de Dados com PostgreSQL', 'Modelagem, consultas e relacionamentos em PostgreSQL.', 'https://exemplo.com/postgres.jpg', 'Banco de Dados']
    );
    const c2 = course2.rows[0].id;
    console.log(`Curso 2 (Banco de Dados com PostgreSQL) criado com id ${c2}`);

    // Modulo 1 Curso 2
    const mod3 = await client.query(
      `INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id`,
      [c2, 'Modelagem', 1]
    );
    const m3 = mod3.rows[0].id;

    // Aulas curso 2
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m3, 'Tabelas e chaves', 'PRIMARY KEY e FOREIGN KEY na prática.', 18, 1]
    );
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m3, 'Relacionamentos', 'Um para muitos: o que são e como usar.', 22, 2]
    );

    // CURSO 3 
    const course3 = await client.query(
      `INSERT INTO courses (title, description, thumbnail, category)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      ['React e Frontend Moderno', 'Introdução ao React: componentes e interfaces reativas.', 'https://exemplo.com/react.jpg', 'Programação']
    );
    const c3 = course3.rows[0].id;
    console.log(`Curso 3 (React e Frontend Moderno) criado com id ${c3}`);

    // Modulo 1 Curso 3
    const mod4 = await client.query(
      `INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id`,
      [c3, 'Componentes', 1]
    );
    const m4 = mod4.rows[0].id;

    // Modulo 2 Curso 3
    const mod5 = await client.query(
      `INSERT INTO modules (course_id, title, position) VALUES ($1, $2, $3) RETURNING id`,
      [c3, 'Avançado', 2]
    );
    const m5 = mod5.rows[0].id;

    // Aulas curso 3
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m4, 'O que é o React', 'Por que componentes e interfaces reativas.', 12, 1]
    );
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m4, 'Componentes e props', 'Como montar interfaces por partes.', 15, 2]
    );
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m4, 'Estado e eventos', 'Interatividade com estado e eventos.', 18, 3]
    );

    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m5, 'Hooks essenciais', 'useEffect, useContext e boas práticas.', 20, 1]
    );
    await client.query(
      `INSERT INTO lessons (module_id, title, description, duration, position) VALUES ($1, $2, $3, $4, $5)`,
      [m5, 'Consumindo APIs', 'Buscando dados de uma API no front.', 22, 2]
    );

    console.log('Seed concluído — 3 cursos, 5 módulos e 12 aulas inseridos!');
  } catch (error) {
    console.error('Erro no seed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();