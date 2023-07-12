import { Router } from "express";
import { manager1 } from "../app.js";
import { socketServer } from "../app.js";
import { productsDbManager } from "../app.js";

const router = Router();

// GET PRODUCTS
router.get('/', async (req, res) => {
  // const products = await manager1.getProducts();
  const products = await productsDbManager.getAll();
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
  let pid = req.params.pid;
  // const productFind = await manager1.getProductById(Number(pid));
  let productFind = await productsDbManager.findProduct(pid);
  if (productFind.length === 0) return res.send({ status: 'no se encontro ningun producto' })
  return productFind === 'CastError' ? res.send({ error: 'no se ingreso un id correcto' }) : res.send({ productFind });
})

// ADD PRODUCT
router.post('/', async (req, res) => {
  let { title, description, code, price, status, stock, category } = req.body;
  if (!title || !description || !code || !price || !status || !stock || !category) {
    return res.send({ error: 'campos incompletos' })
  }
  else if (typeof (title) !== 'string' || typeof (description) !== 'string' ||
    typeof (code) !== 'string' || typeof (price) !== 'number' || typeof (status) !== 'boolean' ||
    typeof (stock) !== 'number' || typeof (category) !== 'string') {
    return res.send({ error: 'Por favor ingrese los datos de los campos correctamente' });
  }
  // let statusRes = await manager1.addProduct(title, description, code, price, status, stock, category)
  // if (statusRes === 'Producto agregado!') socketServer.emit('addProduct', { title, description, code, price, status, stock, category })
  let statusRes = await productsDbManager.addProduct({ title, description, code, price, status, stock, category });
  if (statusRes.code === 11000) return res.send({ status: 'codigo repetido' })
  socketServer.emit('addProduct', { title, description, code, price, status, stock, category })
  return res.send({ status: 'Producto agregado' });
})

// PUT PRODUCT
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { id, ...rest } = req.body;
  // let resUpdateProduct = await manager1.updateProduct(Number(pid), rest);
  let resUpdateProduct = await productsDbManager.updateProduct(pid, rest)
  if (resUpdateProduct.matchedCount === 0) return res.send({ status: 'No se encontro ningun producto con ese id'})
  return resUpdateProduct === 'CastError' ? res.send({ error: 'No se ingreso un id correcto' }) : res.send({ status: 'Producto modificado con exito' });
})

// DELETE PRODUCT
router.delete('/:pid', async (req, res) => {
  let pid = req.params.pid;
  // const product = await manager1.getProductById(pid);
  // const resDelete = await manager1.deleteProduct(pid);
  let productFind = await productsDbManager.findProduct(pid);
  if(productFind === 'CastError' || !productFind) return res.send({ error: 'No se ingreso un id correcto' });
  await productsDbManager.deleteProduct(pid);
  socketServer.emit('deleteProduct', productFind.code)  
  res.send({ status: 'Producto eliminado!' })
  // if (resDelete === 'Producto eliminado!') socketServer.emit('deleteProduct', product.code)
})

export default router;