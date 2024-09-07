"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("./user"));
const client_1 = __importDefault(require("./client"));
const batteryCharge_1 = __importDefault(require("./batteryCharge"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false
});
const db = {};
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
db.user = (0, user_1.default)(sequelize);
db.client = (0, client_1.default)(sequelize);
db.batteryCharge = (0, batteryCharge_1.default)(sequelize);
db.batteryCharge.belongsTo(db.client);
db.client.hasMany(db.batteryCharge);
sequelize.sync({ alter: true, force: false })
    .then(() => {
    console.log('All data in sync');
})
    .catch((error) => {
    console.error('Unable to sync the database:', error);
});
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});
exports.default = db;
