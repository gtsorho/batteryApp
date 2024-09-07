"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const batterycharge_1 = __importDefault(require("../controllers/batterycharge"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post('/', auth_1.default, batterycharge_1.default.createBatteryCharge);
router.get('/', auth_1.default, batterycharge_1.default.getBatteryCharges);
router.get('/:id', auth_1.default, batterycharge_1.default.getBatteryChargeById);
router.put('/:id', auth_1.default, batterycharge_1.default.updateBatteryCharge);
router.delete('/:id', auth_1.default, batterycharge_1.default.deleteBatteryCharge);
router.get('/search', auth_1.default, batterycharge_1.default.searchBatteryCharges);
exports.default = router;
