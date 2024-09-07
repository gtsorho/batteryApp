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
// Define the validation schema for Client
const clientSchema = joi_1.default.object({
    client: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    location: joi_1.default.string().allow(null),
});
exports.default = {
    createClient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { error } = clientSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const client = yield models_1.default.client.create(req.body);
            res.status(201).json(client);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    getClients: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const clients = yield models_1.default.client.findAll({
                include: [{
                        model: models_1.default.batteryCharge,
                    }]
            });
            res.json(clients);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    getClientById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const client = yield models_1.default.client.findByPk(id, {
                include: [{
                        model: models_1.default.batteryCharge, // Include associated batteryCharge records
                    }]
            });
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.json(client);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    updateClient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const { error } = clientSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }
            const [updated] = yield models_1.default.client.update(req.body, { where: { id } });
            if (!updated) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const updatedClient = yield models_1.default.client.findByPk(id, {
                include: [{
                        model: models_1.default.batteryCharge, // Include associated batteryCharge records
                    }]
            });
            res.json(updatedClient);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    deleteClient: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const deleted = yield models_1.default.client.destroy({ where: { id } });
            if (!deleted) {
                return res.status(404).json({ message: 'Client not found' });
            }
            res.json({ message: 'Client deleted successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    searchClients: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const searchValue = req.query.search;
            let queryOptions = {
                include: [{
                        model: models_1.default.batteryCharge, // Include associated batteryCharge records
                    }],
                where: {}
            };
            if (searchValue) {
                queryOptions.where = Object.assign(Object.assign({}, queryOptions.where), { [sequelize_1.Op.or]: [
                        { client: { [sequelize_1.Op.like]: `%${searchValue}%` } },
                        { phone: { [sequelize_1.Op.like]: `%${searchValue}%` } },
                        { location: { [sequelize_1.Op.like]: `%${searchValue}%` } },
                    ] });
            }
            const clients = yield models_1.default.client.findAll(queryOptions);
            res.json(clients);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
};
