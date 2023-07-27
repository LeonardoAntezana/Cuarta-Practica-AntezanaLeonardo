import { Router } from "express";
import { Users } from "../dao/dbManagers/user.js";
import { sendError, sendPayload } from "../utils.js";

const userManager = new Users();
const router = Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const userExist = await userManager.getOneUser({ email });
  if (userExist) return sendError(res, 400, 'Usuario ya existente')
  await userManager.createUser({ first_name, last_name, email, age, password })
  sendPayload(res, 200, 'Usuario registrado');
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) return sendError(res, 400, 'Campos incompletos')
  if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
    req.session.user = { name: email, rol: 'admin' };
    return sendPayload(res, 200, 'Admin logeado')
  }
  
  const user = await userManager.getOneUser({ email, password });
  
  if (!user) return sendError(res, 403, 'Credenciales incorrectas');
  req.session.user = { name:`${user.first_name} ${user.last_name}`, rol: 'user' };
  sendPayload(res, 200, 'Usuario logeado')
})

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return sendError(res, 400, err);
  });
  res.clearCookie('connect.sid')
  res.redirect('/login')
})

export default router;