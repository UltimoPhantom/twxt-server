import { Router } from 'express';
const router = Router();
import {
  createText,
  getAllTexts,
  archiveText,
} from '../controllers/textController.js';

router.post('/', createText);
router.get('/', getAllTexts);
router.patch('/archive/:uuid', archiveText);

export default router;
