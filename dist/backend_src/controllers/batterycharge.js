"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const joi_1 = __importDefault(require("joi"));
const sequelize_1 = require("sequelize");
// Define the validation schema for BatteryCharge
const batteryChargeSchema = joi_1.default.object({
    startTime: joi_1.default.string().required(),
    endTime: joi_1.default.string().required(),
    duration: joi_1.default.number().required(),
    date: joi_1.default.string().required(),
    cost: joi_1.default.number().required(),
    initial: joi_1.default.number().required(),
    final: joi_1.default.number().required(),
    ClientId: joi_1.default.number().required(), // Include the ClientId as a foreign key
});
exports.default = {
    createBatteryCharge: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = batteryChargeSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const batteryCharge = yield models_1.default.batteryCharge.create(req.body);
            res.status(201).json(batteryCharge);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    getBatteryCharges: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const batteryCharges = yield models_1.default.batteryCharge.findAll({
                include: [{
                        model: models_1.default.Client, // Include associated Client records
                    }]
            });
            res.json(batteryCharges);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    getBatteryChargeById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const batteryCharge = yield models_1.default.batteryCharge.findByPk(id, {
                include: [{
                        model: models_1.default.Client, // Include associated Client records
                    }]
            });
            if (!batteryCharge) {
                return res.status(404).json({ message: 'Battery Charge not found' });
            }
            res.json(batteryCharge);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    updateBatteryCharge: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const { error } = batteryChargeSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const [updated] = yield models_1.default.batteryCharge.update(req.body, { where: { id } });
            if (!updated) {
                return res.status(404).json({ message: 'Battery Charge not found' });
            }
            const updatedBatteryCharge = yield models_1.default.batteryCharge.findByPk(id, {
                include: [{
                        model: models_1.default.Client, // Include associated Client records
                    }]
            });
            res.json(updatedBatteryCharge);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    deleteBatteryCharge: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const deleted = yield models_1.default.batteryCharge.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ message: 'Battery Charge not found' });
            }
            res.json({ message: 'Battery Charge deleted successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    searchBatteryCharges: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchValue = req.query.search;
            let queryOptions = {
                include: [{
                        model: models_1.default.Client, // Include associated Client records
                    }],
                where: {}
            };
            if (searchValue) {
                queryOptions.where = Object.assign(Object.assign({}, queryOptions.where), { [sequelize_1.Op.or]: [
                        { startTime: { [sequelize_1.Op.like]: `%${searchValue}%` } },
                        { endTime: { [sequelize_1.Op.like]: `%${searchValue}%` } },
                        { duration: { [sequelize_1.Op.like]: `%${searchValue}%` } },
                        { date: { [sequelize_1.Op.like]: `%${searchValue}%` } },
                        { cost: { [sequelize_1.Op.like]: `%${searchValue}%` } },
                    ] });
            }
            const batteryCharges = yield models_1.default.batteryCharge.findAll(queryOptions);
            res.json(batteryCharges);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
};
