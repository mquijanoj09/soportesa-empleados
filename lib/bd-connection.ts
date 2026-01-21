import mysql, { Connection } from "mysql2/promise";

export async function getConnection(): Promise<Connection> {
  return await mysql.createConnection({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: `1fXCLOUD36917!#!` as string,
    database: process.env.DB_NAME as string,
  });
}
