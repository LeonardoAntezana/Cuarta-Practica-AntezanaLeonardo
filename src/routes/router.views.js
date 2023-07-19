import { Router, query } from "express";
import { manager1 } from "../app.js";
import { socketServer } from "../app.js";
import { messagesManager } from "../app.js";
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
  const { limit = 10 , page = 1, sort, category, status } = req.query;
  let querySort = sort ? `&sort=${sort}` : '';
  let queryFilter;
  if (category) queryFilter = { ...queryFilter, category }
  if (status) queryFilter = { ...queryFilter, status }
  let response = await fetch(`http://localhost:8080/api/products/?limit=${limit}${querySort}&page=${page}`).then(res => res.json());
  if(page < 0 || page > response.totalPages || isNaN(page)){
    return res.send({ status: 'pagina no existente' })
  }
  res.render('products', {
    style: 'products.css',
    response
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