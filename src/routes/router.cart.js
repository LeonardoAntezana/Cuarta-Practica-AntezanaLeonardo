import { Router } from "express";
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
  let resCart = await cartsDbManager.createCart();
  res.send({ status: resCart });
})

// TRAER PRODUCTOS DE UN CARRITO ESPECIFICO
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  let resCartSearch = await cartsDbManager.getOneCart(cid); 
  console.log(resCartSearch)
  if (resCartSearch === 'CastError' || !resCartSearch) return res.send({ status: 'No se ha encontrado ningun carrito con ese id' })
  res.send({ productsCart: resCartSearch.products })
})

// SETEAR PRODUCTS DE CARRITO CON NUEVO ARRAY
router.put('/:cid', async (req, res) => {
  let { cid } = req.params;
  let newArray = req.body;
  let resCartSearch = await cartsDbManager.getOneCart(cid);
  if (resCartSearch === 'CastError' || !resCartSearch) return res.send({ status: 'No se ha encontrado ningun carrito con ese id' }) 
  for (const prod of newArray) {
    if(!prod.hasOwnProperty('product') || !prod.hasOwnProperty('quantity') || typeof(prod.quantity) !== "number"){
      return res.send({ status: 'Campos de producto incorrectos' });
    }
    let existProduct = await productsDbManager.findProduct(prod.product);
    
    if(existProduct.length === 0) return res.send({ status: 'Producto inexistente' })
  }
  await cartsDbManager.setProductsToCart(cid, newArray);
  res.send({ status: 'Carrito modificado exitosamente' });
})

// ELIMINAR PRODUCTOS DEL CARRITO
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  let response = await cartsDbManager.deleteAllProductsToCart(cid);
  res.send({ status: response })
})

// AGREGAR UN PRODUCTO ESPECIFICO A UN CARRITO ESPECIFICO
router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  let cartSearch = await cartsDbManager.getOneCart(cid);
  let productSearch = await productsDbManager.findProduct(pid);
  if (!cartSearch || cartSearch === 'CastError') {
    return res.send({ status: 'Carrito inexistente' });
  }
  else if (productSearch.length === 0 || productSearch === 'CastError') {
    return res.send({ status: 'Producto inexistente' })
  }
  let resAddProduct = await cartsDbManager.addProductToCart(cid, pid);
  res.send({ status: resAddProduct })
})

// SETEAR NUEVA QUANTITY DE UN PRODUCTO DEL CARRITO
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  let { quantity } = req.body;
  let response = await cartsDbManager.updateQuantityProduct(cid, pid, Number(quantity));
  res.send({ status: response })
})

// ELIMINAR UN PRODUCTO DE UN CARRITO
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  let cartSearch = await cartsDbManager.getOneCart(cid);
  let productSearch = await productsDbManager.findProduct(pid);
  if (!cartSearch || cartSearch === 'CastError') {
    return res.send({ status: 'Carrito inexistente' });
  }
  else if (productSearch.length === 0 || productSearch === 'CastError') {
    return res.send({ status: 'Producto inexistente' })
  }
  let resDeleteProduct = await cartsDbManager.deleteProductToCart(cid, pid);
  res.send({ status: resDeleteProduct })
})

export default router;