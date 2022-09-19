import { Pool } from "pg";

const pool = new Pool();

export const query = pool.query.bind(pool);
