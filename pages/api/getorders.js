import connectDB from "@/app/utils/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Connect to the database
      const connection = await connectDB();

      // Fetch orders
      const [orders] = await connection.execute(
        `SELECT 
          id AS orderId, 
          totalPrice, 
          createdAt 
        FROM 
          orders 
        WHERE 
          email = ?`,
        [email]
      );

      // Fetch products associated with these orders
      const orderIds = orders.map(order => order.orderId);
      if (orderIds.length === 0) {
        return res.status(200).json(orders);
      }

      const [products] = await connection.execute(
        `SELECT 
          p.id AS productId, 
          p.name AS productName, 
          p.price AS productPrice, 
          op.orderId
        FROM 
          products p
        JOIN 
          order_products op ON p.id = op.productId
        WHERE 
          op.orderId IN (?)`,
        [orderIds]
      );

      // Combine orders with their products
      const orderMap = {};

      orders.forEach(order => {
        orderMap[order.orderId] = {
          ...order,
          products: []
        };
      });

      products.forEach(product => {
        if (orderMap[product.orderId]) {
          orderMap[product.orderId].products.push({
            id: product.productId,
            name: product.productName,
            price: product.productPrice
          });
        }
      });

      const formattedOrders = Object.values(orderMap);

      // Return the orders with products as JSON
      res.status(200).json(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Error fetching orders' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
