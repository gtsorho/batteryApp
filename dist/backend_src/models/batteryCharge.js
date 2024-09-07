"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const createBatteryChargeModel = (sequelize) => {
    const BatteryCharge = sequelize.define('BatteryCharge', {
        startTime: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        endTime: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        duration: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        date: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false
        },
        cost: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        initial: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        },
        final: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false
        }
    }, {
        timestamps: true
    });
    return BatteryCharge;
};
exports.default = createBatteryChargeModel;
