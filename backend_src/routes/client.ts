import express from 'express';
import clientController from '../controllers/client';
import authenticateJWT from "../middleware/auth";

const router = express.Router();

router.post('/', authenticateJWT, clientController.createClient);
router.get('/', authenticateJWT, clientController.getClients);
router.get('/:id', authenticateJWT, clientController.getClientById);
router.put('/:id', authenticateJWT, clientController.updateClient);
router.delete('/:id', authenticateJWT, clientController.deleteClient);
router.get('/search', authenticateJWT, clientController.searchClients);

export default router;
