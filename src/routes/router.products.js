import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { checkAuthorization } from "../utils.js";

const router = Router();

// GET PRODUCTS
router.get('/', productController.getAllPaginate);

// FIND PRODUCT
router.get('/:pid', productController.findProduct);

// ADD PRODUCT
router.post('/', checkAuthorization('user'), productController.addProduct);

// PUT PRODUCT
router.put('/:pid', checkAuthorization('user'), productController.updateProduct);

// DELETE PRODUCT
router.delete('/:pid', checkAuthorization('user'), productController.deleteProduct);

export default router;