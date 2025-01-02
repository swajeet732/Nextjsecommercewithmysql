import connectDB from "@/app/utils/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email, limit = 10, page = 0 } = req.query;

    // Ensure the email parameter is provided
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Parse limit and page into integers
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);

      // Check if parsedLimit and parsedPage are valid numbers
      if (isNaN(parsedLimit) || isNaN(parsedPage)) {
        return res.status(400).json({ error: 'Invalid limit or page value' });
      }

      const connection = await connectDB();

      // Fetch total count of orders
      const totalOrdersQuery = `SELECT COUNT(*) AS totalOrders FROM orders WHERE email = '${email}'`;
      const [totalOrdersResult] = await connection.execute(totalOrdersQuery);
      const totalOrders = totalOrdersResult[0].totalOrders;

      // Fetch orders with pagination
      const ordersQuery = `SELECT 
          id AS orderId, 
          totalPrice, 
          createdAt 
        FROM 
          orders 
        WHERE 
          email = '${email}' 
        LIMIT ${parsedLimit} OFFSET ${parsedPage * parsedLimit}`;
      
      const [orders] = await connection.execute(ordersQuery);

      if (orders.length === 0) {
        return res.status(200).json({ orders, pagination: { limit: parsedLimit, page: parsedPage, totalOrders } });
      }

      // Respond only with totalPrice for each order
      const orderSummary = orders.map(order => ({
        totalPrice: order.totalPrice,
      }));

      res.status(200).json({
        orders: orderSummary,
        pagination: {
          limit: parsedLimit,
          page: parsedPage,
          totalOrders,
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Error fetching orders' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
