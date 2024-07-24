// src/app/pages/api/getUserDetails.js

import connectDB from "@/app/utils/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    try {
      // Connect to the database
      const connection = await connectDB();

      // Fetch user by email with selected fields: id, token, username, email, and token expiration
      const [rows] = await connection.execute('SELECT id, token, username, email, token_expiration FROM users WHERE email = ?', [email]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = rows[0];

      // Check if the token is expired
      const currentTime = new Date();
      if (new Date(user.token_expiration) < currentTime) {
        return res.status(401).json({ message: 'Token expired' });
      }

      // Return user details
      res.status(200).json({
        id: user.id,
        token: user.token,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
