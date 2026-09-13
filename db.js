import { Pool } from "pg";
import 'dotenv/config';

export const db = new Pool(
    {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        ssl: {
            rejectUnauthorized: false
        }
    }
)