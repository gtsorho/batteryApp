import express from 'express';
import batteryChargeController from '../controllers/batterycharge';
import authenticateJWT from "../middleware/auth";

const router = express.Router();

router.post('/', authenticateJWT, batteryChargeController.createBatteryCharge);
router.get('/', authenticateJWT, batteryChargeController.getBatteryCharges);
router.get('/:id', authenticateJWT, batteryChargeController.getBatteryChargeById);
router.put('/:id', authenticateJWT, batteryChargeController.updateBatteryCharge);
router.delete('/:id', authenticateJWT, batteryChargeController.deleteBatteryCharge);
router.get('/search', authenticateJWT, batteryChargeController.searchBatteryCharges);

export default router;
