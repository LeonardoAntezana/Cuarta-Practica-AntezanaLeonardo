import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
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
import authRouter from './routes/router.auth.js'

const app = express();

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://leonardoantezana59:zHXuMizLukj6R75z@ecommerce-coderhouse.sfxkmnu.mongodb.net/?retryWrites=true&w=majority',
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 300
  }),
  secret: "Lucy",
  resave: false,
  saveUninitialized: false
}))
app.use(cookieParser());

// SERVER
const httpServer = app.listen(8080, console.log('Server arriba'))
export const socketServer = new Server(httpServer);

// MONGOOSE CONNECTION
mongoose.connect('mongodb+srv://leonardoantezana59:zHXuMizLukj6R75z@ecommerce-coderhouse.sfxkmnu.mongodb.net/?retryWrites=true&w=majority').                   //CONNECTION DATABASE//
  catch(error => {
    console.log(error)
    process.exit();
  });

// HANDLEBARS
app.use(express.static(`${__dirname}/public`));
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');

// INSTANCIAS DE MANAGERS
export const manager1 = new ProductManager('Leonardo', './products.json')
export const cartManager1 = new CartManager('./carts.json');
export const messagesManager = new Messages();
export const productsDbManager = new Products();
export const cartsDbManager = new Carts();

// ROUTERS
app.use('/', viewRouter)
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter)
app.use('/auth/', authRouter)

socketServer.on('connection', async (socket) => {

  socket.on('sendMessage', async (data) => {
    await messagesManager.addMessage(data);
    socketServer.emit('newMessage', data);
  })

})