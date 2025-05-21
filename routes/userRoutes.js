import { Router } from 'express';
const router = Router();
import { getUsers, createUser } from '../controllers/userController';

router.get('/', getUsers);
router.post('/', createUser);

export default router;
