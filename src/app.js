import express from 'express';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import { Server } from 'socket.io';
import { ProductManager } from './dao/fileManagers/ProductManager.js';
import { CartManager } from './dao/fileManagers/CartManager.js';
import productsRouter from './routes/router.products.js'
import cartRouter from './routes/router.cart.js'
import viewRouter from './routes/router.views.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const httpServer = app.listen(8080, console.log('Server arriba'))
export const socketServer = new Server(httpServer);

mongoose.connect('mongodb+srv://leonardoantezana59:zHXuMizLukj6R75z@ecommerce-coderhouse.sfxkmnu.mongodb.net/?retryWrites=true&w=majority').                   //CONNECTION DATABASE//
  catch(error => {
    console.log(error)
    process.exit();
  });

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');
app.use('/', viewRouter)
app.use(express.static(`${__dirname}/public`));

export const manager1 = new ProductManager('Leonardo', './products.json')
export const cartManager1 = new CartManager('./carts.json');

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter)