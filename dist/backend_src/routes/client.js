"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = __importDefault(require("../controllers/client"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/', auth_1.default, client_1.default.createClient);
router.get('/', auth_1.default, client_1.default.getClients);
router.get('/:id', auth_1.default, client_1.default.getClientById);
router.put('/:id', auth_1.default, client_1.default.updateClient);
router.delete('/:id', auth_1.default, client_1.default.deleteClient);
router.get('/search', auth_1.default, client_1.default.searchClients);
exports.default = router;
