import productRepository from '../models/repositories/product.repository.js'
import { sendError, sendPayload } from "../utils.js";
import enumErrors from '../errors/enum.errors.js';
import CustomError from '../errors/customError.js';
import { sendErrorInfo } from '../errors/product.errorInfo.js';

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
  addProduct = async (req, res, next) => {
    const { title, description, code, price, status, stock, category, owner } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category) {
      const error = CustomError.createError({
        name: 'InvalidData',
        cause: sendErrorInfo(req.body),
        message: 'Please enter the correct data',
        code: enumErrors.INCOMPLETE_DATA
      });
      return next(error);
    }
    else if (typeof (title) !== 'string' || typeof (description) !== 'string' ||
      typeof (code) !== 'string' || typeof (price) !== 'number' || typeof (status) !== 'boolean' ||
      typeof (stock) !== 'number' || typeof (category) !== 'string') {
      const error = CustomError.createError({
        name: 'Invalid types of data',
        cause: sendErrorInfo(req.body),
        message: 'Please enter the correct data',
        code: enumErrors.ERROR_DATA_TYPES
      });
      return next(error);
    }
    const findProduct = await productRepository.findProductByCode(code);
    if (findProduct) return sendError(res, 400, 'Product already exists');
    let statusRes = await productRepository.addProduct({ title, description, code, price, status, stock, category, owner });
    //socketServer.emit('addProduct', { title, description, code, price, status, stock, category })    
    sendPayload(res, 200, statusRes);
  }

  // PUT PRODUCT
  updateProduct = async (req, res) => {
    const { pid } = req.params;
    const { id, ...rest } = req.body;
    const { role, email } = req.user;
    let productFind = await productRepository.findProduct(pid);
    if (role === 'premium' && email !== productFind.owner) return sendError(res, 403, 'You cannot delete this product');
    let resUpdateProduct = await productRepository.updateProduct(pid, rest);
    if (resUpdateProduct.matchedCount === 0 || resUpdateProduct === 'CastError') return sendError(res, 400, 'Product not found');
    sendPayload(res, 200, 'Product modified successfully');
  }

  // DELETE PRODUCT
  deleteProduct = async (req, res) => {
    const { pid } = req.params;
    const { role, email } = req.user;
    let productFind = await productRepository.findProduct(pid);
    if (!productFind || productFind === 'CastError') return sendError(res, 400, 'Product not found');
    if (role === 'premium' && email !== productFind.owner) return sendError(res, 403, 'You cannot delete this product');
    await productsInstance.deleteProduct(pid);
    // socketServer.emit('deleteProduct', productFind.code)
    sendPayload(res, 200, 'Product deleted successfully');
  }

}

export default new ProductController();