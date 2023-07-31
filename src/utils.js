import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// FUNCIONES REUTILIZABLES PARA RES.SEND

export const sendError = (res, statusCode, message) => res.status(statusCode).send({ error: message })

export const sendPayload = (res, statusCode, payload) => res.status(statusCode).send({ payload })

// MIDDLEWARES DE AUTENTICACION

export const checkAuthorization = (req, res, next) => {
  if(!req.session.user) return res.redirect('/login');
  next(); 
}

export const checkSession = (req, res, next) => {
  if(req.session.user) return res.redirect('/products');
  next();
}

// FUNCIONES DE HASHEO CON BCRYPT

export const generateHash = password => hashSync(password, genSaltSync(10));

export const isValidPassword = (password, hashedPassword) => compareSync(password, hashedPassword);

export default __dirname;