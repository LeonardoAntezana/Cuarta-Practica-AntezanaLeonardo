import { Router } from "express";
import userController from "../controllers/user.controller.js";

const router = Router();

router.post('/sendemail', userController.sendEmail);

router.post('/recoverpassword', userController.updatePassword);

router.put('/premium/:uid', userController.updateRole);

export default router;