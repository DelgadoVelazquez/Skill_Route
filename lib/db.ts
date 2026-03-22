import mysql from 'mysql2/promise';

// Pool de conexiones — reutiliza conexiones entre requests
const pool = mysql.createPool({
  host:     process.env.MYSQL_HOST     ?? 'localhost',
  port:     Number(process.env.MYSQL_PORT ?? 3306),
  user:     process.env.MYSQL_USER     ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? '',
  database: process.env.MYSQL_DATABASE ?? 'skillroute',
  waitForConnections: true,
  connectionLimit:    10,
});

export default pool;
