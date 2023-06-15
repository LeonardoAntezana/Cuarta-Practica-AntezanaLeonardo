import { Router } from "express";
import { manager1 } from "../app.js";
import { cartManager1 } from "../app.js";

const router = Router();

// CREAR CARRITO
router.post('/', async (req, res) => {
  const resCart = await cartManager1.createCart();
  res.send({ status: resCart });
})

// TRAER PRODUCTOS DE UN CARRITO ESPECIFICO
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cartSearch = await cartManager1.getCartById(Number(cid));
  if (!cartSearch) {
    return res.send({ status: 'No existe carrito con ese id' });
  }
  res.send({ productsCart: cartSearch.products })
})

// AGREGAR UN PRODUCTO ESPECIFICO A UN CARRITO ESPECIFICO
router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  let cartExist = await cartManager1.getCartById(Number(cid));
  let productExist = await manager1.getProductById(Number(pid));
  if(!cartExist){
    return res.send({status: 'Carrito inexistente'});
  }
  else if(!productExist){
    return res.send({status: 'Producto inexistente'})
  }
  const resAddProduct = await cartManager1.addProductToCart(cartExist.id, productExist.id);
  res.send({status: resAddProduct})
})

// DELETE CART BY ID
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  let resDeleteCart = await cartManager1.deleteCartById(Number(cid));
  res.send({status: resDeleteCart});
})

export default router;