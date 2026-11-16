// One tiny interface (query/exec) over two Postgres backends:
//  - DATABASE_URL set  -> real PostgreSQL via `pg` (production)
//  - otherwise         -> PGlite (real Postgres compiled to WASM), zero-setup local dev
import fs from 'node:fs';
import pg from 'pg';

let impl;
if (process.env.DATABASE_URL) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  impl = { query: (t, p) => pool.query(t, p), exec: (t) => pool.query(t) };
} else {
  const { PGlite } = await import('@electric-sql/pglite');
  const dir = process.env.PGLITE_DIR || './.data/pglite';
  if (!dir.startsWith('memory://')) fs.mkdirSync(dir, { recursive: true });
  const db = new PGlite(dir);
  impl = { query: (t, p) => db.query(t, p), exec: (t) => db.exec(t) };
}

export const query = (text, params = []) => impl.query(text, params);
export const migrate = () =>
  impl.exec(fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));
