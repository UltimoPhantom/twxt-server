import { Router } from 'express';
const router = Router();
import {
  createText,
  getAllTexts,
  archiveText,
  deleteText,
} from '../controllers/textController.js';

router.post('/', createText);
router.get('/', getAllTexts);
router.patch('/archive/:uuid', archiveText);
router.delete('/:id', deleteText);

export default router;