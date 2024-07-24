import connectDB from "@/app/utils/db";

export default async function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      if (query.id) {
        return getCustomerById(req, res);
      } else {
        return getAllCustomers(req, res);
      }
    case 'POST':
      return createCustomer(req, res);
    case 'PUT':
      return updateCustomer(req, res);
    case 'DELETE':
      return deleteCustomer(req, res);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function getCustomerById(req, res) {
  const { id } = req.query;

  // Validate the ID
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const connection = await connectDB();
    const [rows] = await connection.execute('SELECT * FROM customers WHERE id = ?', [parseInt(id, 10)]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customer = rows[0];
    console.log(customer,'customer');
    res.status(200).json(customer);
  } catch (error) {
    console.error('Get customer details error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
}


async function getAllCustomers(req, res) {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM customers');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Get all customers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function createCustomer(req, res) {
  const { firstName, lastName, email, address, city, state, zipCode, country, phone } = req.body;

  // Validate input
  if (!firstName || !lastName || !email || !address || !city || !state || !zipCode || !country || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Replace undefined values with null
  const customerData = {
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    email: email ?? null,
    address: address ?? null,
    city: city ?? null,
    state: state ?? null,
    zipCode: zipCode ?? null,
    country: country ?? null,
    phone: phone ?? null
  };

  try {
    const connection = await connectDB();

    // Check if the email already exists
    const [existingCustomer] = await connection.execute('SELECT * FROM customers WHERE email = ?', [customerData.email]);
    if (existingCustomer.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert new customer
    const [result] = await connection.execute(
      `INSERT INTO customers (firstName, lastName, email, address, city, state, zipCode, country, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [firstName, lastName, email, address, city, state, zipCode, country, phone]
    );
    

    // Retrieve the newly created customer
    const [newCustomer] = await connection.execute('SELECT * FROM customers WHERE id = ?', [result.insertId]);
    res.status(201).json(newCustomer[0]);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function updateCustomer(req, res) {
  const { id } = req.query;
  const { firstName, lastName, address, city, state, zipCode, country, phone } = req.body;

  console.log('Request body:', req.body);

  // Validate the ID
  if (!id || isNaN(parseInt(id, 10))) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const connection = await connectDB();
    const [result] = await connection.execute(
      'UPDATE customers SET firstName = ?, lastName = ?, address = ?, city = ?, state = ?, zipCode = ?, country = ?, phone = ?, updated_at = NOW() WHERE id = ?',
      [
        firstName || '',  // Default to empty string if not provided
        lastName || '',   // Default to empty string if not provided
        address || '',    // Default to empty string if not provided
        city || '',       // Default to empty string if not provided
        state || '',      // Default to empty string if not provided
        zipCode || '',    // Default to empty string if not provided
        country || '',    // Default to empty string if not provided
        phone || '',      // Default to empty string if not provided
        parseInt(id, 10)  // Ensure ID is a number
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ id, ...req.body });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

async function deleteCustomer(req, res) {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const connection = await connectDB();
    const [result] = await connection.execute('DELETE FROM customers WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
