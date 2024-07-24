import connectDB from '../../src/app/utils/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    case 'PUT':
      return updateProduct(req, res);
    case 'DELETE':
      return deleteProduct(req, res);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function getProducts(req, res) {
  const connection = await connectDB();
  try {
    const [rows] = await connection.query('SELECT * FROM products');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function createProduct(req, res) {
  const connection = await connectDB();
  try {
    const { name, price, description, category, imageUrl } = req.body;
    const [result] = await connection.query('INSERT INTO products (name, price, description, category, imageUrl) VALUES (?, ?, ?, ?, ?)', [name, price, description, category, imageUrl]);
    res.status(201).json({ id: result.insertId, name, price, description, category, imageUrl });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function updateProduct(req, res) {
  const connection = await connectDB();
  try {
    const { id, name, price, description, category, imageUrl } = req.body;
    const [result] = await connection.query('UPDATE products SET name = ?, price = ?, description = ?, category = ?, imageUrl = ? WHERE id = ?', [name, price, description, category, imageUrl, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ id, name, price, description, category, imageUrl });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function deleteProduct(req, res) {
  const connection = await connectDB();
  try {
    const { id } = req.body;
    const [result] = await connection.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
