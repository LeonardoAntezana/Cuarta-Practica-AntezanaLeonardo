import { Router } from "express";
import { manager1 } from "../app.js";
import { socketServer } from "../app.js";
import { messagesManager } from "../app.js";
import { checkAuthorization, checkSession } from "../utils.js";

const router = Router();

router.get('/', async (req, res) => {
  // const products = await manager1.getProducts();
  // res.render('home', {
  //   style: 'realTimeProducts.css',
  //   products
  // });
  res.redirect('/login');
})

router.get('/products', checkAuthorization, async (req, res) => {
  const { limit = 10 , page = 1, sort, category, status } = req.query;
  let querySort = sort ? `&sort=${sort}` : '';
  let queryCategory = category ? `&category=${category}` : '';
  let queryStatus = status ? `&status=${status}` : ''
  let response = await fetch(`http://localhost:8080/api/products/?limit=${limit}${querySort}${queryCategory}${queryStatus}&page=${page}`).then(res => res.json());
  if(page < 0 || page > response.totalPages || isNaN(page)){
    return res.send({ status: 'pagina no existente' })
  }
  res.render('products', {
    style: 'products.css',
    response,
    user: req.session.user,
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
  let cartProducts = await fetch(`http://localhost:8080/api/carts/${cid}`).then(res => res.json());
  if (cartProducts.status){
    return res.send({ status: cartProducts.status })
  }
  res.render('detailsCart', { style: 'detailsCart.css', cartProducts });
})

router.get('/chat', async (req, res) => {
  const messages = await messagesManager.getAll();
  res.render('chat', {
    style: 'chat.css',
    messages
  })
})

// AUTHENTICATION
router.get('/register', (req, res) => {
  res.render('register', { style: 'user.css' });
})

router.get('/login', checkSession, (req, res) => {
  res.render('login', { style: 'user.css' })
})

router.get('/profile', (req, res) => {
  res.render('profile', { style: 'user.css' })
})

export default router;