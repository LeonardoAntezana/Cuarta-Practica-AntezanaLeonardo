import { Router } from "express";
import { socketServer } from "../app.js";
import { productsDbManager } from "../app.js";
import { sendPayload, sendError } from "../utils.js";

const router = Router();

// GET PRODUCTS
router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, category, status } = req.query;
  let query = { ...(category && { category }), ...(status && { status }) };
  let { docs, totalPages, page: pages, prevPage, nextPage, hasNextPage, hasPrevPage } = await productsDbManager.getAllPaginate(limit, page, 'price', sort, query);

  let actualUrl = req.url;
  const newUrl = `/products${actualUrl.length > 1 ? (actualUrl.includes('page') ? actualUrl.slice(1,-1) : actualUrl + '&page=') : '?page='}`;

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
  if (productFind.length === 0) return sendResponse(res, 400, 'No se encontro ningun producto')
  return productFind === 'CastError' ? sendResponse(res, 400, 'No se ingreso un id correcto') : sendPayload(res, 200, productFind);
})

// ADD PRODUCT
router.post('/', async (req, res) => {
  let { title, description, code, price, status, stock, category } = req.body;
  if (!title || !description || !code || !price || !status || !stock || !category) {
    return sendError(res, 400, 'Campos incompletos');
  }
  else if (typeof (title) !== 'string' || typeof (description) !== 'string' ||
    typeof (code) !== 'string' || typeof (price) !== 'number' || typeof (status) !== 'boolean' ||
    typeof (stock) !== 'number' || typeof (category) !== 'string') {
    return sendError(res, 400, 'Por favor ingrese los datos de los campos correctamente');
  }
  let statusRes = await productsDbManager.addProduct({ title, description, code, price, status, stock, category });
  if (statusRes.code === 11000) return res.send({ status: 'codigo repetido' })
  socketServer.emit('addProduct', { title, description, code, price, status, stock, category })
  return sendPayload(res, 200, 'Producto agregado')
})

// PUT PRODUCT
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { id, ...rest } = req.body;
  let resUpdateProduct = await productsDbManager.updateProduct(pid, rest)
  if (resUpdateProduct.matchedCount === 0) return sendError(res, 400, 'No se encontro ningun producto con ese id')
  return resUpdateProduct === 'CastError' ? sendError(res, 400, 'No se ingreso un id correcto') : sendPayload(res, 200, 'Producto modificado con exito');
})

// DELETE PRODUCT
router.delete('/:pid', async (req, res) => {
  let pid = req.params.pid;
  let productFind = await productsDbManager.findProduct(pid);
  if (productFind === 'CastError' || !productFind) sendError(re, 400, 'No se ingreso un id correcto');
  await productsDbManager.deleteProduct(pid);
  socketServer.emit('deleteProduct', productFind.code)
  res.send({ status: 'Producto eliminado!' })
})

export default router;