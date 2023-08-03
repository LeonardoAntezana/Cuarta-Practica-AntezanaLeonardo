import { Router } from "express";
import passport from "passport";
import { sendPayload, sendError } from "../utils.js";

const router = Router();

// PASSPORT GITHUB
router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), (req, res) => { })

// CALLBACK GITHUB
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  req.session.user = { name: req.user._doc.first_name, rol: 'user' };
  res.redirect('/')
})

// REGISTER
router.post('/register', passport.authenticate('register', { failureRedirect: '/login' }), async (req, res) => {
  sendPayload(res, 200, 'Usuario registrado');
})

// LOGIN
router.post('/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
  try {
    let { first_name, last_name, rol } = req.user;
    req.session.user = { name: `${first_name} ${last_name || ''}`, rol };
    if (rol === 'admin') return sendPayload(res, 200, 'Admin logeado')
    sendPayload(res, 200, 'Usuario logeado')
  } catch (error) {
    sendError(res, 400, error);
  }
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