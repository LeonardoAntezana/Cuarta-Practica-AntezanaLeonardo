import { Router } from "express";
import { manager1 } from "../app.js";
import { socketServer } from "../app.js";

const router = Router();

router.get('/', async (req, res) => {
  const products = await manager1.getProducts();
  res.render('home', {
    products
  });
})

router.get('/realtimeproducts', async (req, res) => {
  socketServer.on('connection', () => console.log('cliente conectado'))
  const products = await manager1.getProducts();
  res.render('realTimeProducts', {
    style: 'realTimeProducts.css',
    products
  });
})

export default router;