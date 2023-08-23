import { Router } from "express";
import productController from "../controllers/product.controller.js";

const router = Router();

// GET PRODUCTS
router.get('/', productController.getAllPaginate);

// FIND PRODUCT
router.get('/:pid', productController.findProduct);

// ADD PRODUCT
router.post('/', productController.addProduct);

// PUT PRODUCT
router.put('/:pid', productController.updateProduct);

// DELETE PRODUCT
router.delete('/:pid', productController.deleteProduct);

export default router;