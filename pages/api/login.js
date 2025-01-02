// pages/api/login.js

import connectDB from '../../src/app/utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      return handleLogin(req.body, res);
    case 'PUT':
      return handleUpdatePassword(req.body, res);
    case 'GET':
      return handleGetUserDetails(req.query, res);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function handleLogin({ email, password }, res) {
  const connection = await connectDB();
  try {
    // Find user by email
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user already has a token
    if (user.token) {
      return res.status(200).json({ token: user.token });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Save token to user document
    await connection.execute('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);

    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    // Don't close the connection explicitly, as we are using connection pooling
    // Connection pooling handles connection management automatically
  }
}

async function handleUpdatePassword({ email, newPassword }, res) {
  const connection = await connectDB();
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}

async function handleGetUserDetails({ token }, res) {
  const connection = await connectDB();
  try {
    // Find user by token
    const [rows] = await connection.execute('SELECT * FROM users WHERE token = ?', [token]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('Get user details error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
