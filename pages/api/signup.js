// src/app/pages/api/signup.js

import connectDB from '../../src/app/utils/db';
// import User from '../../src/app/models/User';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

connectDB();

export default async function handler(req, res) {
  const db = await connectDB();

  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      // Check if user with same email already exists
      const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      await db.query(
        'INSERT INTO users (username, email, password, token) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, uuidv4()]
      );

      // Respond with success message
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

