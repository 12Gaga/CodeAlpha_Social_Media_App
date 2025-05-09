import pkg from "pg";
const { Client } = pkg;

const db = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "233253",
  database: "social-media-app",
});

db.connect();

export default db;
