import mysql from 'mysql2/promise';

let pool;

async function connectDB() {
  if (pool) {
    console.log('Using existing pool');
    return pool;
  }

  try {
    // Create a connection pool
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nextjs_ecommerce',
      waitForConnections: true,
      connectionLimit: 10, // Adjust the connection limit based on your needs
      queueLimit: 0, // Unlimited queue size
    });

    console.log('MySQL pool connected');
    return pool;
  } catch (error) {
    console.error('Error connecting to MySQL pool:', error.message);
    throw error;
  }
}

export default connectDB;
