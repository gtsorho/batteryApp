import express from 'express';
import userController from '../controllers/user';
import authenticateJWT  from "../middleware/auth";

const router = express.Router();


router.post('/', userController.createUser);
router.post('/login', userController.login);
router.get('/', authenticateJWT, userController.getUsers);
router.get('/:id', authenticateJWT, userController.getUser);
router.delete('/:id', authenticateJWT, userController.destroyUser);

export default router;
 