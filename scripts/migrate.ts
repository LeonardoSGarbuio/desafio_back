import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const { Client } = pg;

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Conectado ao banco!');

    const sql = readFileSync(join(process.cwd(), 'sql', 'schema.sql'), 'utf8');

    await client.query(sql);
    console.log('Migration executada — tabelas criadas!');
  } catch (error) {
    console.error('Erro na migration:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();