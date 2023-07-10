import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';

import { ProductManager } from './dao/fileManagers/ProductManager.js';
import { CartManager } from './dao/fileManagers/CartManager.js';

import Messages from './dao/dbManagers/message.js';
import Products from './dao/dbManagers/product.js';
import Carts from './dao/dbManagers/cart.js'

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

app.use(express.static(`${__dirname}/public`));
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');

export const manager1 = new ProductManager('Leonardo', './products.json')
export const cartManager1 = new CartManager('./carts.json');
export const messagesManager = new Messages();
export const productsDbManager = new Products();
export const cartsDbManager = new Carts();

app.use('/', viewRouter)
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter)

socketServer.on('connection', async (socket) => {

  socket.on('sendMessage', async (data) => {
    let res = await messagesManager.addMessage(data);
    if(res.code !== 11000) socketServer.emit('newMessage', data);
  })

})