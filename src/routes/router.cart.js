import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { checkAuthorization, decodeToken } from "../utils.js";

const router = Router();

// TRAER TODO LOS CARRITOS
router.get('/', CartController.getAll);

// CREAR CARRITO
router.post('/', CartController.createCart);

// TRAER PRODUCTOS DE UN CARRITO ESPECIFICO
router.get('/:cid', CartController.getOneCart);

// BUY CART
router.post('/:cid/purchase', CartController.buyCart);

// AGREGAR UN PRODUCTO ESPECIFICO A UN CARRITO ESPECIFICO
router.post('/:cid/products/:pid', decodeToken, checkAuthorization(['admin']), CartController.addProductToCart);

// ELIMINAR UN PRODUCTO DE UN CARRITO
router.delete('/:cid/products/:pid', decodeToken, checkAuthorization(['admin']), CartController.deleteProductToCart);

// ELIMINAR PRODUCTOS DEL CARRITO
router.delete('/:cid', decodeToken, checkAuthorization(['admin']), CartController.deleteAllProductsToCart);

// SETEAR PRODUCTS DE CARRITO CON NUEVO ARRAY
router.put('/:cid', decodeToken, checkAuthorization(['admin']), CartController.setProductsToCart);

// SETEAR NUEVA QUANTITY DE UN PRODUCTO DEL CARRITO
router.put('/:cid/products/:pid', decodeToken, checkAuthorization(['admin']), CartController.updateQuantityProduct);

export default router;