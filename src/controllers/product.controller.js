import productRepository from '../models/repositories/product.repository.js'
import { sendError, sendPayload } from "../utils.js";

class ProductController {

  // GET PRODUCTS
  getAllPaginate = async (req, res) => {
    const { limit = 10, page = 1, sort, category, status } = req.query;
    let query = { ...(category && { category }), ...(status && { status }) };
    let { docs, totalPages, page: pages, prevPage, nextPage, hasNextPage, hasPrevPage } = await productRepository.getAllPaginate(limit, page, 'price', sort, query);

    let actualUrl = req.url;
    const newUrl = `/products${actualUrl.length > 1 ? (actualUrl.includes('page') ? actualUrl.slice(1, -1) : actualUrl + '&page=') : '?page='}`;

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
    sendPayload(res, 200, response);
  }

  // FIND PRODUCT
  findProduct = async (req, res) => {
    const { pid } = req.params;
    let productFind = await productRepository.findProduct(pid);
    if (!productFind || productFind === 'CastError') return sendError(res, 400, 'Product not found');
    sendPayload(res, 200, productFind);
  }

  // ADD PRODUCT
  addProduct = async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) {
      return sendError(res, 400, 'Incomplete fields');
    }
    else if (typeof (title) !== 'string' || typeof (description) !== 'string' ||
      typeof (code) !== 'string' || typeof (price) !== 'number' || typeof (status) !== 'boolean' ||
      typeof (stock) !== 'number' || typeof (category) !== 'string') {
      return sendError(res, 400, 'Please enter the correct data');
    }
    let statusRes = await productRepository.addProduct({ title, description, code, price, status, stock, category });
    if (statusRes.code = 11000) return sendError(res, 400, 'Product already exists');
    //socketServer.emit('addProduct', { title, description, code, price, status, stock, category })    
    sendPayload(res, 200, statusRes);
  }

  // PUT PRODUCT
  updateProduct = async (req, res) => {
    const { pid } = req.params;
    const { id, ...rest } = req.body;
    let resUpdateProduct = await productRepository.updateProduct(pid, rest);
    if (resUpdateProduct.matchedCount === 0 || resUpdateProduct === 'CastError') return sendError(res, 400, 'Product not found');
    sendPayload(res, 200, 'Product modified successfully');
  }

  // DELETE PRODUCT
  deleteProduct = async (req, res) => {
    const { pid } = req.params;
    let productFind = await productRepository.findProduct(pid);
    if (!productFind || productFind === 'CastError') return sendError(res, 400, 'Product not found');
    await productsInstance.deleteProduct(pid);
    // socketServer.emit('deleteProduct', productFind.code)
    sendPayload(res, 200, 'Product deleted successfully');
  }

}

export default new ProductController();