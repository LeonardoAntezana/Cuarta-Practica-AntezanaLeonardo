import { Router } from "express";
import { generateProduct, sendPayload } from "../utils.js";

const router = Router();

router.get('/', async (req, res) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }
  sendPayload(res, 200, products);
})

export default router;