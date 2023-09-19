import { Router } from "express";
import { sendPayload } from "../utils.js";

const router = Router();

router.get('/', async (req, res) => {
  const { logger } = req;
  logger.fatal('Fatal error');
  logger.error('Error');
  logger.warning('Warning');
  logger.info('Info');
  logger.debug('Debug');
  sendPayload(res, 200, 'Probando logs con winston');
})

export default router;