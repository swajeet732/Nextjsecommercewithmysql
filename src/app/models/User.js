import { DataTypes } from 'sequelize';
import sequelize from '../utils/db'; // Import your database connection

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    unique: true,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

export default User;
