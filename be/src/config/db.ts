import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "asrama_db",
  password: "jfgscm27_",
  port: 5432,
});

export default pool;
