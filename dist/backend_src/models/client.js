"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const createClientModel = (sequelize) => {
    const Client = sequelize.define('Client', {
        client: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: true
    });
    return Client;
};
exports.default = createClientModel;
