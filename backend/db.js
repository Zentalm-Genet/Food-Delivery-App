// Note: I Use Database credentials are stored in the .env file

/*PORT=4000
DB_HOST=''
DB_USER=''
DB_PASSWORD=''
DB_NAME=''
DB_PORT=''
*/

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
});

export default sequelize;
