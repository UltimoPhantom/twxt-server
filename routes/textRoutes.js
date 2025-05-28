import { Router } from 'express';

import {
  createText,
  getAllTexts,
  archiveText,
  deleteText,
} from '../controllers/textController.js';

const router = Router();

router.post('/', createText);
router.get('/', getAllTexts);
router.patch('/archive/:uuid', archiveText);
router.delete('/:id', deleteText);

export default router;
