import { Router } from "express";
import { passportAuth } from "../config/passport.utilities.js";
import authController from "../controllers/auth.controller.js";
import { sendPayload } from "../utils.js";

const router = Router();

// PASSPORT GITHUB
router.get('/github', passportAuth('github', { scope: ['user: email'] }), (req, res) => { })

// CALLBACK GITHUB
router.get('/githubcallback', passportAuth('github', { failureRedirect: '/login' }), authController.githubCallback);

// REGISTER
router.post('/register', passportAuth('register', { failureRedirect: '/login' }), authController.register)

// LOGIN
router.post('/login', passportAuth('login', { failureRedirect: '/login' }), authController.login)

// STRATEGY JWT

router.get('/current', passportAuth('current', { session: false }), (req, res) => {
  sendPayload(res, 200, req.user)
})

// LOG0UT
router.get('/logout', authController.logout)

export default router;