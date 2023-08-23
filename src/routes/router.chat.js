import { Router } from 'express';
import chatController from '../controllers/chat.controller.js';

const router = Router();

// GET MESSAGES
router.get('/', chatController.getAll);

// ADD MESSAGE
router.post('/', chatController.addMessage);

export default router;
