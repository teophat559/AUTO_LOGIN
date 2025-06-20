import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

async function initializeDatabase() {
  try {
    // Create login_results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_results (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        otp VARCHAR(10),
        status VARCHAR(50) NOT NULL,
        type VARCHAR(50),
        message TEXT,
        cookies TEXT,
        ip VARCHAR(45),
        chrome_path TEXT,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create proxy_stats table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proxy_stats (
        id SERIAL PRIMARY KEY,
        host VARCHAR(255) NOT NULL,
        port INTEGER NOT NULL,
        username VARCHAR(255),
        password VARCHAR(255),
        success_count INTEGER NOT NULL DEFAULT 0,
        fail_count INTEGER NOT NULL DEFAULT 0,
        last_used TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(host, port)
      );
    `);

    // Create login_history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_history (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        type VARCHAR(50),
        message TEXT,
        ip VARCHAR(45),
        chrome_path TEXT,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();