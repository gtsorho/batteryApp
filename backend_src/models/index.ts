import { Sequelize } from 'sequelize';
import user from './user';
import client from './client';
import batteryCharge from './batteryCharge';

import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DATABASE!, 
    process.env.DB_USERNAME!, 
    process.env.DB_PASSWORD!, 
    {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        dialect: 'mysql',
        logging: false
    }
);

const db: any = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = user(sequelize);
db.client = client(sequelize);
db.batteryCharge = batteryCharge(sequelize);

db.batteryCharge.belongsTo(db.client) 
db.client.hasMany(db.batteryCharge)

sequelize.sync({alter: true, force: false})
.then(() => {
    console.log('All data in sync');
})
.catch((error: any) => {
    console.error('Unable to sync the database:', error);
});



sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error: any) => {
    console.error('Unable to connect to the database:', error);
});

export default db;
