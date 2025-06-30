import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Crear el pool de conexiones
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

});

// Crear la instancia de Drizzle
export const db = drizzle(pool, { casing: 'snake_case' });

// Exportar el pool para poder cerrarlo cuando sea necesario
export { pool };
