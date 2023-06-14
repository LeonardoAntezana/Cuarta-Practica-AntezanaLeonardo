import express from 'express';
import { ProductManager } from './ProductManager.js'
import { CartManager } from './CartManager.js';
import productsRouter from './routes/router.products.js'
import cartRouter from './routes/router.cart.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

export const manager1 = new ProductManager('Leonardo', './products.json')
export const cartManager1 = new CartManager('./carts.json');

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter)

app.listen(8080, console.log('Server arriba'))