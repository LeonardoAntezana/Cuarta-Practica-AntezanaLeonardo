import { Router } from "express";
import { socketServer } from "../app.js";
import { productsDbManager } from "../app.js";

const router = Router();

// GET PRODUCTS
router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, category, status } = req.query;
  let query;
  if (category) query = { ...query, category }
  if (status) query = { ...query, status }
  let { docs, totalPages, page: pages, prevPage, nextPage, hasNextPage, hasPrevPage } = await productsDbManager.getAllPaginate(limit, page, 'price', sort, query);

  let actualUrl = req.url;
  let newUrl = '/products';

  if(actualUrl.length > 1){
    if(!actualUrl.includes('page')){
      newUrl += actualUrl + '&page='
    }
    else{   
      newUrl += actualUrl.slice(1,-1);
    }
  }
  else{
    newUrl += actualUrl + '?page='
  }

  let response = {
    status: docs ? 'success' : 'error',
    payload: docs,
    totalPages,
    prevPage,
    nextPage,
    page: pages,
    hasNextPage,
    hasPrevPage,
    prevLink: prevPage ? `${newUrl}${pages - 1}` : null,
    nextLink: nextPage ? `${newUrl}${pages + 1}` : null,
  }
  res.send(response);
})

// FIND PRODUCT
router.get('/:pid', async (req, res) => {
  let pid = req.params.pid;
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
  let statusRes = await productsDbManager.addProduct({ title, description, code, price, status, stock, category });
  if (statusRes.code === 11000) return res.send({ status: 'codigo repetido' })
  socketServer.emit('addProduct', { title, description, code, price, status, stock, category })
  return res.send({ status: 'Producto agregado' });
})

// PUT PRODUCT
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { id, ...rest } = req.body;
  let resUpdateProduct = await productsDbManager.updateProduct(pid, rest)
  if (resUpdateProduct.matchedCount === 0) return res.send({ status: 'No se encontro ningun producto con ese id' })
  return resUpdateProduct === 'CastError' ? res.send({ error: 'No se ingreso un id correcto' }) : res.send({ status: 'Producto modificado con exito' });
})

// DELETE PRODUCT
router.delete('/:pid', async (req, res) => {
  let pid = req.params.pid;
  let productFind = await productsDbManager.findProduct(pid);
  if (productFind === 'CastError' || !productFind) return res.send({ error: 'No se ingreso un id correcto' });
  await productsDbManager.deleteProduct(pid);
  socketServer.emit('deleteProduct', productFind.code)
  res.send({ status: 'Producto eliminado!' })
})

export default router;