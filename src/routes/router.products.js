import { Router } from "express";
import { manager1 } from "../app.js";
import { socketServer } from "../app.js";

const router = Router();

// GET PRODUCTS
router.get('/', async (req, res) => {
  const products = await manager1.getProducts();
  const { limit } = req.query;
  if (limit) {
    if (limit < products.length) {
      const filter = products.slice(0, limit);
      return res.send({ products: filter })
    }
    return res.send({ error: 'fuera de rango' })
  }
  res.send({ products });
})

// FIND PRODUCT
router.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const productFind = await manager1.getProductById(Number(pid));
  return productFind ? res.send({ productFind }) : res.send({ error: 'producto no encontrado' })
})

// ADD PRODUCT
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;
  if (!title || !description || !code || !price || !status || !stock || !category) {
    return res.send({ error: 'campos incompletos' })
  }
  else if (typeof (title) !== 'string' || typeof (description) !== 'string' ||
    typeof (code) !== 'string' || typeof (price) !== 'number' || typeof (status) !== 'boolean' ||
    typeof (stock) !== 'number' || typeof (category) !== 'string') {
      return res.send({error: 'Por favor ingrese los datos de los campos correctamente'});
  }
  const statusRes = await manager1.addProduct(title, description, code, price, status, stock, category)
  if (statusRes === 'Producto agregado!') socketServer.emit('addProduct', { title, description, code, price, status, stock, category })
  return res.send({ status: statusRes });
})

// PUT PRODUCT
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { id, ...rest } = req.body;
  let resUpdateProduct = await manager1.updateProduct(Number(pid), rest);
  res.send({ status: resUpdateProduct });
})

// DELETE PRODUCT
router.delete('/:pid', async (req, res) => {
  const pid = Number(req.params.pid);
  const product = await manager1.getProductById(pid);
  const resDelete = await manager1.deleteProduct(pid);
  if (resDelete === 'Producto eliminado!') {
    socketServer.emit('deleteProduct', product.code)
  }
  res.send({ status: resDelete });
})

export default router;