import { Router } from "express";
// import { manager1 } from "../app.js";
// import { cartManager1 } from "../app.js";
import { cartsDbManager } from "../app.js";
import { productsDbManager } from "../app.js";

const router = Router();

// TRAER TODO LOS CARRITOS
router.get('/', async (req, res) => {
  let carts = await cartsDbManager.getAll();
  res.send({ carts })
})

// CREAR CARRITO
router.post('/', async (req, res) => {
  // const resCart = await cartManager1.createCart();
  let resCart = await cartsDbManager.createCart();
  res.send({ status: resCart });
})

// TRAER PRODUCTOS DE UN CARRITO ESPECIFICO
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  let resCartSearch = await cartsDbManager.getOneCart(cid);
  if (resCartSearch === 'CastError' || !resCartSearch) return res.send({ status: 'No se ha encontrado ningun carrito con ese id' })
  // const cartSearch = await cartManager1.getCartById(Number(cid));
  // if (!cartSearch) return res.send({ status: 'No existe carrito con ese id' });
  res.send({ productsCart: resCartSearch.products })
})

// AGREGAR UN PRODUCTO ESPECIFICO A UN CARRITO ESPECIFICO
router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  // let cartExist = await cartManager1.getCartById(Number(cid));
  // let productExist = await manager1.getProductById(Number(pid));
  let cartSearch = await cartsDbManager.getOneCart(cid);
  let productSearch = await productsDbManager.findProduct(pid);
  if (!cartSearch || cartSearch === 'CastError') {
    return res.send({ status: 'Carrito inexistente' });
  }
  else if (productSearch.length === 0 || productSearch === 'CastError') {
    return res.send({ status: 'Producto inexistente' })
  }
  // let resAddProduct = await cartManager1.addProductToCart(cartExist.id, productExist.id);
  let resAddProduct = await cartsDbManager.addProductToCart(cid, pid);
  res.send({ status: resAddProduct })
})

export default router;