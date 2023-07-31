import { Router } from "express";
import passport from "passport";
import { userDbManager as userManager } from "../app.js";
import { generateHash, isValidPassword, sendError, sendPayload } from "../utils.js";

const router = Router();

// PASSPORT 
router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), (req, res) => {})

// CALLBACK GITHUB
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = { name: req.user._doc.first_name, rol: 'user' };
  res.redirect('/')
})

// REGISTER
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  if( !first_name || !last_name || !email || !age || !password ) return sendError(res, 400, 'Campos incompletos');
  const userExist = await userManager.getOneUser({ email });
  if (userExist) return sendError(res, 400, 'Usuario ya existente')
  let auxUser = { first_name, last_name, email, age, password: generateHash(password) }
  await userManager.createUser(auxUser)
  sendPayload(res, 200, 'Usuario registrado');
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) return sendError(res, 400, 'Campos incompletos')
  if(email === 'adminCoder@coder.com' && password === 'adminCod3r123'){
    req.session.user = { name: email, rol: 'admin' };
    return sendPayload(res, 200, 'Admin logeado')
  }
  
  const user = await userManager.getOneUser({ email });
  
  if (!user) return sendError(res, 403, 'Usuario no encontrado');
  if(!isValidPassword(password, user.password)) return sendError(res, 403, 'Credenciales erroneas')
  req.session.user = { name:`${user.first_name} ${user.last_name}`, rol: 'user' };
  sendPayload(res, 200, 'Usuario logeado')
})

// LOG0UT
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return sendError(res, 400, err);
  });
  res.clearCookie('connect.sid')
  res.redirect('/login')
})

export default router;