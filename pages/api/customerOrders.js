import connectDB from '@/app/utils/db';
import Customer from '@/app/models/Customer';
import Order from '@/app/models/Order';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    await connectDB();
  
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
  
    try {
      const results = await Customer.aggregate([
        {
          $match: { email: email },
        },
        {
          $lookup: {
            from: 'orders',
            localField: 'email',
            foreignField: 'email',
            as: 'orders',
          },
        },
      ]);
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No customer found with this email' });
      }
  
      res.status(200).json(results[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching customer orders' });
    }
  }