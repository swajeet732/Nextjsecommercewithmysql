// utils/db.js

import mysql from 'mysql2/promise';

let connection;

async function connectDB() {
  if (connection) {
    console.log('Using existing connection');
    return connection;
  }

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'Nextjsecommerce'
    });
    console.log('MySQL connected');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    throw error;
  }
}

export default connectDB;
