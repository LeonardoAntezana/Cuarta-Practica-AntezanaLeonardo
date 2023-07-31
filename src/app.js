import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';

import Messages from './dao/dbManagers/message.js';
import Products from './dao/dbManagers/product.js';
import Carts from './dao/dbManagers/cart.js'
import Users from './dao/dbManagers/user.js';

import productsRouter from './routes/router.products.js'
import cartRouter from './routes/router.cart.js'
import viewRouter from './routes/router.views.js'
import authRouter from './routes/router.auth.js'

const app = express();

// MONGOOSE CONNECTION
mongoose.connect(`mongodb+srv://leonardoantezana59:zHXuMizLukj6R75z@ecommerce-coderhouse.sfxkmnu.mongodb.net/?retryWrites=true&w=majority`).catch(error => {
  console.log(error)
  process.exit();
});

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initializePassport();
app.use(passport.initialize());
app.use(session({
  store: MongoStore.create({
    mongoUrl: `mongodb+srv://leonardoantezana59:zHXuMizLukj6R75z@ecommerce-coderhouse.sfxkmnu.mongodb.net/?retryWrites=true&w=majority`,
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

// HANDLEBARS
app.use(express.static(`${__dirname}/public`));
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');

// INSTANCIAS DE MANAGERS
export const messagesManager = new Messages();
export const productsDbManager = new Products();
export const cartsDbManager = new Carts();
export const userDbManager = new Users();

// ROUTERS
app.use('/', viewRouter)
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter)
app.use('/api/auth/', authRouter)

socketServer.on('connection', async (socket) => {

  socket.on('sendMessage', async (data) => {
    await messagesManager.addMessage(data);
    socketServer.emit('newMessage', data);
  })

})