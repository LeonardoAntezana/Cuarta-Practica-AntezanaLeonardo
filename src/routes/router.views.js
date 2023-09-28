import { Router } from "express";
import { socketServer } from "../app.js";
import { checkAuthorization, checkSession, checkCookie, sendError } from "../utils.js";

const router = Router();

router.get('/', async (req, res) => {
  res.redirect('/login');
})

router.get('/products', checkAuthorization('admin'), async (req, res) => {
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
    payload: response.payload,
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
  try {
    let cartProducts = await fetch(`http://localhost:8080/api/carts/${cid}`).then(res => res.json());
    if (cartProducts.status) return res.send({ status: cartProducts.status })
    res.render('detailsCart', { style: 'detailsCart.css', cartProducts });
  } catch (error) {
    return sendError(res, 400, error);
  }
})

router.get('/chat', checkAuthorization('admin'), async (req, res) => {
  const messages = await fetch(`http://localhost:8080/api/chat`).then(res => res.json());
  res.render('chat', {
    style: 'chat.css',
    messages
  })
})

// RECUPERACION DE CONTRASEÑA

router.get('/putemail', (req, res) => {
  res.render('putemail', { style: 'auth.css' })
})

router.get('/recoverpassword', checkCookie('authRecover', 'Tiempo expirado'), (req, res) => {
  res.render('recoverpassword', { style: 'auth.css' })
})

// AUTHENTICATION
router.get('/register', (req, res) => {
  res.render('register', { style: 'auth.css' });
})

router.get('/login', checkSession, (req, res) => {
  res.render('login', { style: 'auth.css' })
})

router.get('/profile', (req, res) => {
  res.render('profile', { style: 'user.css' })
})

export default router;