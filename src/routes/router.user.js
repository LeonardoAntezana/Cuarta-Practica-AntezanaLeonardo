import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { uploader } from "../middlewares/multer.js";

const router = Router();

router.get('/', userController.getAll);

router.delete('/:uid', userController.deleteUser);

router.delete('/', userController.deleteAll);

router.post('/sendemail', userController.sendEmail);

router.post('/recoverpassword', userController.updatePassword);

router.put('/premium/:uid', userController.updateRole);

router.post('/:uid/documents', uploader.array('documents') , userController.updateDocuments);
 
export default router;