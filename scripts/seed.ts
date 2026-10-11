import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    // Trava para não haver duplicação
    const total = await prisma.course.count();

    if (total > 0) {
      console.log(`Já existem ${total} cursos no banco. Insert ignorado.`);
      return;
    }

    // CURSO 1: Desenvolvimento Web Fullstack
    const c1 = await prisma.course.create({
      data: {
        title: 'Desenvolvimento Web Fullstack',
        description: 'Introdução prática ao desenvolvimento web, do front ao back.',
        thumbnail: 'https://exemplo.com/fullstack.jpg',
        category: 'Programação',
        modules: {
          create: [
            {
              title: 'Fundamentos',
              position: 1,
              lessons: {
                create: [
                  {
                    title: 'Introdução à Web',
                    description: 'Como a internet funciona.',
                    duration: 15,
                    position: 1,
                  },
                  {
                    title: 'HTML e CSS',
                    description: 'Estrutura e estilo de páginas.',
                    duration: 20,
                    position: 2,
                  },
                  {
                    title: 'JavaScript básico',
                    description: 'Fundamentos de JavaScript para páginas.',
                    duration: 25,
                    position: 3,
                  },
                ],
              },
            },
            {
              title: 'Backend',
              position: 2,
              lessons: {
                create: [
                  {
                    title: 'Node.js',
                    description: 'Rodando JavaScript no servidor.',
                    duration: 30,
                    position: 1,
                  },
                  {
                    title: 'APIs REST',
                    description: 'Como criar e consumir endpoints.',
                    duration: 35,
                    position: 2,
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log(`Curso 1 (Desenvolvimento Web Fullstack) criado com id ${c1.id}`);

    // CURSO 2: Banco de Dados com PostgreSQL
    const c2 = await prisma.course.create({
      data: {
        title: 'Banco de Dados com PostgreSQL',
        description: 'Modelagem, consultas e relacionamentos em PostgreSQL.',
        thumbnail: 'https://exemplo.com/postgres.jpg',
        category: 'Banco de Dados',
        modules: {
          create: [
            {
              title: 'Modelagem',
              position: 1,
              lessons: {
                create: [
                  {
                    title: 'Tabelas e chaves',
                    description: 'PRIMARY KEY e FOREIGN KEY na prática.',
                    duration: 18,
                    position: 1,
                  },
                  {
                    title: 'Relacionamentos',
                    description: 'Um para muitos: o que são e como usar.',
                    duration: 22,
                    position: 2,
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log(`Curso 2 (Banco de Dados com PostgreSQL) criado com id ${c2.id}`);

    // CURSO 3: React e Frontend Moderno
    const c3 = await prisma.course.create({
      data: {
        title: 'React e Frontend Moderno',
        description: 'Introdução ao React: componentes e interfaces reativas.',
        thumbnail: 'https://exemplo.com/react.jpg',
        category: 'Programação',
        modules: {
          create: [
            {
              title: 'Componentes',
              position: 1,
              lessons: {
                create: [
                  {
                    title: 'O que é o React',
                    description: 'Por que componentes e interfaces reativas.',
                    duration: 12,
                    position: 1,
                  },
                  {
                    title: 'Componentes e props',
                    description: 'Como montar interfaces por partes.',
                    duration: 15,
                    position: 2,
                  },
                  {
                    title: 'Estado e eventos',
                    description: 'Interatividade com estado e eventos.',
                    duration: 18,
                    position: 3,
                  },
                ],
              },
            },
            {
              title: 'Avançado',
              position: 2,
              lessons: {
                create: [
                  {
                    title: 'Hooks essenciais',
                    description: 'useEffect, useContext e boas práticas.',
                    duration: 20,
                    position: 1,
                  },
                  {
                    title: 'Consumindo APIs',
                    description: 'Buscando dados de uma API no front.',
                    duration: 22,
                    position: 2,
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log(`Curso 3 (React e Frontend Moderno) criado com id ${c3.id}`);

    console.log('Seed concluído — 3 cursos, 5 módulos e 12 aulas inseridos!');
  } catch (error) {
    console.error('Erro no seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();