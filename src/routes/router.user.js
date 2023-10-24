import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { uploader } from "../middlewares/multer.js";

const router = Router();

router.post('/sendemail', userController.sendEmail);

router.post('/recoverpassword', userController.updatePassword);

router.put('/premium/:uid', userController.updateRole);

router.post('/:uid/documents', uploader.array('documents') , userController.updateDocuments);

// router.post('/:uid/documents', uploader.fields([ { name: 'documents', maxCount: 3 }, { name: 'profiles', maxCount: 1 }, { name: 'products', maxCount: 3 } ]), userController.updateDocuments);
 
export default router;