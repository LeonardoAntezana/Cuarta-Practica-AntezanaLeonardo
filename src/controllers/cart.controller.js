import cartService from '../services/cart.service.js';
import productService from '../services/product.service.js';
import { sendError, sendPayload } from '../utils.js';

const cartInstance = cartService.getInstance();
const productInstance = productService.getInstance();

class CartController {

  // GET CARTS
  getAll = async (req, res) => {
    const carts = await cartInstance.getAll();
    sendPayload(res, 200, carts);
  }

  // CREATE CART
  createCart = async (req, res) => {
    const cart = await cartInstance.createCart();
    sendPayload(res, 200, cart);
  }

  // GET PRODUCTS FROM CART
  getOneCart = async (req, res) => {
    const { cid } = req.params;
    if (!cid) return sendError(res, 400, 'Bad Request');
    const response = await cartInstance.getOneCart(cid);
    response !== 'CastError' || !response
      ? sendPayload(res, 200, response.products)
      : sendError(res, 400, 'Cart not found');
  }

  // DELETE PRODUCTS FROM CART
  deleteAllProductsToCart = async (req, res) => {
    const { cid } = req.params;
    if (!cid) return sendError(res, 400, 'Bad Request');
    const response = await cartInstance.deleteAllProductsToCart(cid);
    response === 'No se encontro el carrito'
      ? sendPayload(res, 200, response)
      : sendError(res, 400, response);
  }

  // SET PRODUCTS TO CART
  setProductsToCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    let responseCart = await cartInstance.getOneCart(cid);
    if (!responseCart || responseCart === 'CastError') return sendError(res, 400, 'Cart not found');
    for(const prod of products) {
      if(!prod.hasOwnProperty('product') || !prod.hasOwnProperty('quantity') || typeof(prod.quantity) !== "number"){
        return sendError(res, 400, 'Wrong fields');
      }
      let existProd = await productInstance.findProduct(prod.product);
      if(existProd.length === 0) return sendError(res, 400, `Product '${prod}' not found`);
    }
    await cartInstance.setProductsToCart(cid, products);
    sendPayload(res, 200, 'Cart modified successfully');
  }

  // ADD PRODUCTS TO CART
  addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const cartFind = await cartInstance.addProductToCart(cid, pid);
    const prodFind = await productInstance.findProduct(pid);
    if (!cartFind || cartFind === 'CastError') {
      return sendError(res, 400, 'Cart not found');
    }
    else if (prodFind.length === 0 || productSearch === 'CastError') {
      return sendError(res, 400, 'Product not found');
    }
    let responseAddProduct = await cartInstance.addProductToCart(cid, pid);
    sendPayload(res, 200, responseAddProduct);
  }

  // DELETE PRODUCT TO CART
  deleteProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    let cartFind = await cartInstance.getOneCart(cid);
    let productFind = await productInstance.findProduct(pid);
    if (!cartFind || cartFind === 'CastError') {
      return sendError(res, 400, 'Cart not found');
    }
    else if (productFind.length === 0 || productFind === 'CastError') {
      return sendError(res, 400, 'Product not found');
    }
    let responseDeleteProduct = await cartInstance.deleteProductToCart(cid, pid);
    sendPayload(res, 200, responseDeleteProduct);
  }

  // SET QUANTITY PRODUCT
  updateQuantityProduct = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    let response = await cartInstance.updateQuantityProduct(cid, pid, Number(quantity));
    sendPayload(res, 200, response);
  }

}

export default new CartController();