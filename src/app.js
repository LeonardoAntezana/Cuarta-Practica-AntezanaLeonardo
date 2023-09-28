import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import keys from './config/config.env.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars'
import { addLogger } from './config/winston/logger.winston.js';
import __dirname from './utils.js';

import productsRouter from './routes/router.products.js'
import cartRouter from './routes/router.cart.js'
import viewRouter from './routes/router.views.js'
import authRouter from './routes/router.auth.js'
import chatRouter from './routes/router.chat.js'
import userRouter from './routes/router.user.js'
import mocksRouter from './routes/router.mock.js'
import logsRouter from './routes/router.log.js'

const app = express();

// MONGOOSE CONNECTION
mongoose.connect(keys.MONGO_URL).catch(error => {
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
    mongoUrl: keys.MONGO_URL,
    mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    ttl: 300
  }),
  secret: "Lucy",
  resave: false,
  saveUninitialized: false
}))
app.use(cookieParser('Farah'));
app.use(addLogger);

// SERVER
const httpServer = app.listen(keys.PORT, console.log('Server arriba'))
export const socketServer = new Server(httpServer);

// HANDLEBARS
app.use(express.static(`${__dirname}/public`));
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');

// ROUTERS
app.use('/loggertest', logsRouter)
app.use('/mockingproducts', mocksRouter)
app.use('/', viewRouter)
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter)
app.use('/api/auth/', authRouter)
app.use('/api/chat/', chatRouter)
app.use('/api/user/', userRouter)

// socketServer.on('connection', async (socket) => {

//   socket.on('sendMessage', async (data) => {
//     await messagesManager.addMessage(data);
//     socketServer.emit('newMessage', data);
//   })

// })