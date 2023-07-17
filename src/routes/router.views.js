import { Router } from "express";
import { manager1 } from "../app.js";
import { socketServer } from "../app.js";
import { messagesManager } from "../app.js";
import { productsDbManager } from "../app.js";
import { cartsDbManager } from "../app.js";

const router = Router();

router.get('/', async (req, res) => {
  const products = await manager1.getProducts();
  res.render('home', {
    style: 'realTimeProducts.css',
    products
  });
})

router.get('/products', async (req, res) => {
  let { page = 1 } = req.query;
  let { docs: products, hasNextPage, hasPrevPage, prevPage, nextPage } = await productsDbManager.getAllPaginate(10, page);
  res.render('products', {
    style: 'products.css',
    response: { products, hasNextPage, hasPrevPage, prevPage, nextPage }
  })
})

router.get('/realtimeproducts', async (req, res) => {
  socketServer.on('connection', () => console.log('cliente conectado'))
  const products = await manager1.getProducts();
  res.render('realTimeProducts', {
    style: 'realTimeProducts.css',
    products
  });
})

router.get('/carts/:cid', async (req, res) => {
  let { cid } = req.params;
  let { products } = await cartsDbManager.getOneCart(cid);
  if (products){
    return res.render('detailsCart', { style: 'detailsCart.css', products });
  }
  res.send({ status: 'No se encontro nigun carrito' })
})

router.get('/chat', async (req, res) => {
  const messages = await messagesManager.getAll();
  res.render('chat', {
    style: 'chat.css',
    messages
  })
})

export default router;