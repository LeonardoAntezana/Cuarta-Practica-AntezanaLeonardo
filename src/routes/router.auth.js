import { Router } from "express";
import { sendPayload, sendError, generateToken } from "../utils.js";
import { passportAuth } from "../config/passport.utilities.js";

const router = Router();

// PASSPORT GITHUB
router.get('/github', passportAuth('github', { scope: ['user: email'] }), (req, res) => { })

// CALLBACK GITHUB
router.get('/githubcallback', passportAuth('github', { failureRedirect: '/login' }), (req, res) => {
  
  let { first_name, last_name, role } = req.user;
  req.session.user = { name: `${first_name} ${last_name || ''}`, role };
  let token = generateToken({first_name, last_name, role}, '10h');
  res.cookie('authCookie', token, { httpOnly: true });
  res.redirect('/')
})

// REGISTER
router.post('/register', passportAuth('register', { failureRedirect: '/login' }), async (req, res) => {
  sendPayload(res, 200, 'Usuario registrado');
})

// LOGIN
router.post('/login', passportAuth('login', { failureRedirect: '/login' }), async (req, res) => {
  try {
    let { first_name, last_name, role } = req.user;
    req.session.user = { name: `${first_name} ${last_name || ''}`, role };
    let token = generateToken({first_name, last_name, role}, '10h');
    res.cookie('authCookie', token, { httpOnly: true });
    if (role === 'admin') return sendPayload(res, 200, 'Admin logeado')
    sendPayload(res, 200, 'Usuario logeado')
  } catch (error) {
    sendError(res, 400, error);
  }
})

// STRATEGY JWT

router.get('/current', passportAuth('current', { session: false }), (req, res) => {
  res.send({ payload: req.user })
})

// LOG0UT
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return sendError(res, 400, err);
  });
  res.clearCookie('connect.sid')
  res.clearCookie('authCookie')
  res.redirect('/login')
})

export default router;