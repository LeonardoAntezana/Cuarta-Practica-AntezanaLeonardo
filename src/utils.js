import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker/locale/es';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FUNCIONES REUTILIZABLES PARA RES.SEND

export const sendError = (res, statusCode, message) => res.status(statusCode).send({ error: message })

export const sendPayload = (res, statusCode, payload) => res.status(statusCode).send({ payload })

// MIDDLEWARES DE AUTENTICACION

export const checkAuthorization = (rolesNotAcepted = []) => (req, res, next) => {
  if(rolesNotAcepted.includes(req.user.role)) return sendError(res, 403, 'No tienes permisos para realizar esta accion');
  next(); 
}

export const decodeToken = (req, res, next) => {
  let token = req.cookies['authCookie'];
  jwt.verify(token, 'Farah', (err, decoded) => {
    if(err) return sendError(res, 403, 'No tienes autenticacion activa');
    req.user = decoded;
    next();
  })
}

export const checkSession = (req, res, next) => {
  if(req.session.user) return res.redirect('/products');
  next();
}

export const checkCookie = (nameCookie, messageError) => (req, res, next) => {
  if(!req.cookies[nameCookie]) return sendError(res, 403, messageError);
  next();
}

// FUNCION DE UUID PARA CODE UNICO
export const generateUUID = () => uuid();

// FUNCIONES DE HASHEO CON BCRYPT

export const generateHash = password => hashSync(password, genSaltSync(10));

export const isValidPassword = (password, hashedPassword) => compareSync(password, hashedPassword);

// FUNCIONES Y MIDDLEWARES CON JWT
const PRIVATE_KEY = 'Farah'

export const generateToken = (user, expiresIn) => jwt.sign(user, PRIVATE_KEY, { expiresIn });

// FUNCIONES DE FAKER
export const generateProduct = () => ({
  _id: faker.database.mongodbObjectId(),
  title: faker.commerce.product(),
  description: faker.commerce.productDescription(),
  code: generateUUID(),
  price: faker.commerce.price(),
  status: true,
  stock: Math.floor(faker.commerce.price({max: 100, min: 1})),
  category: faker.commerce.department(),
})

export default __dirname;