import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Only use SSL if explicitly enabled (for production/cloud databases)
// For local PostgreSQL, SSL is usually not needed
const sslConfig = process.env.DATABASE_SSL === "true" 
  ? { rejectUnauthorized: false }
  : false;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: sslConfig,
});

