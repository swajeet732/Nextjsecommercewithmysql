import { DataTypes } from 'sequelize';
import sequelize from '../utils/db'; // Import your database connection

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Not required
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  tableName: 'products', // Optional: specify the table name if you want to override default pluralized table name
});

export default Product;
