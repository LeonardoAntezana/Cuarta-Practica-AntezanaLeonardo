import express from 'express';
import mongoose from 'mongoose';
import keys from './config/config.env.js';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars'
import { addLogger } from './config/winston/logger.winston.js';
import { serve, setup } from 'swagger-ui-express';
import specs from './config/swagger/config.swagger.js'
import __dirname from './utils.js';

import productsRouter from './routes/router.products.js'
import cartRouter from './routes/router.cart.js'
import viewRouter from './routes/router.views.js'
import authRouter from './routes/router.auth.js'
import chatRouter from './routes/router.chat.js'
import userRouter from './routes/router.user.js'

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
app.use(cookieParser('Farah'));
app.use(addLogger);
app.use('/apidocs', serve, setup(specs));

// SERVER
const httpServer = app.listen(keys.PORT, console.log('Server arriba'))
export const socketServer = new Server(httpServer);

// HANDLEBARS
app.use(express.static(`${__dirname}/public`));
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars');

// ROUTERS
app.use('/', viewRouter)
app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartRouter)
app.use('/api/auth/', authRouter)
app.use('/api/chat/', chatRouter)
app.use('/api/user/', userRouter)
