import { Router } from 'express';
import { registerUser, loginUser, getUsers, getUserById } from '../controllers/userController.js';

const router = Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// User management routes
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
