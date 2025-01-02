// models/Order.js

import { DataTypes } from 'sequelize';
import sequelize from '../utils/db'; // Import your database connection
import Product from './Product'; // Import Product model

const Order = sequelize.define('Order', {
  products: {
    type: DataTypes.JSONB, // Storing product references as JSON array
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  tableName: 'orders', // Optional: specify the table name if you want to override the default pluralized table name
});

// Define many-to-many relationship between Order and Product models
Order.belongsToMany(Product, { through: 'OrderProduct' });
Product.belongsToMany(Order, { through: 'OrderProduct' });

export default Order;
