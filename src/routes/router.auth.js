import { Router } from "express";
import { Users } from "../dao/dbManagers/user.js";

const userManager = new Users();
const router = Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const userExist = await userManager.getOneUser({ email });
  if (userExist) return res.status(400).send({ status: "error", error: "Users already exists" })
  await userManager.createUser({ first_name, last_name, email, age, password })
  res.status(200).send({ status: "success", message: "User registered" })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await userManager.getOneUser({ email, password });
  
  if (!user) return res.status(400).send({ status: "error", error: "Incorrect credentials" })
  let userSession = { name: `${user.first_name} ${user.last_name}`, rol: 'user'};
  if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') userSession.rol = 'admin'
  req.session.user = userSession;
  res.status(200).send({ status: "success", message: "User logged" })
})

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(400).send('Error destroying session:', err);
  });
  res.status(200).send({status:'succes', payload:'Session destroyed'})
})

export default router;