import sequelize from '../db.js'; 
import { DataTypes } from 'sequelize';

const Order = sequelize.define('Order', {
  id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
  },
  userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  items: {
      type: DataTypes.JSONB,
      allowNull: false,
  },
  amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
  },
  address: {
      type: DataTypes.JSONB,
      allowNull: false,
  },
  status: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  date: {
      type: DataTypes.DATE,
      allowNull: false,
  },
  payment: {
      type: DataTypes.STRING,
      allowNull: false,
  }
}, {
  tableName: 'orders',
  timestamps: false, 
});

export default Order;
