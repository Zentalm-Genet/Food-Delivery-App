import sequelize from '../db.js'; 
import { DataTypes } from 'sequelize';

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cartdata: {
        type: DataTypes.JSONB,
        defaultValue: {}
    }
}, {
    tableName: 'users',
    timestamps: false
});

export default User;
