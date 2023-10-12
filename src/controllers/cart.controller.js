import cartRepository from '../models/repositories/cart.repository.js';
import productRepository from '../models/repositories/product.repository.js';
import ticketRepository from '../models/repositories/ticket.repository.js'
import { sendError, sendPayload, generateUUID } from '../utils.js';

class CartController {

  // GET CARTS
  getAll = async (req, res) => {
    const carts = await cartRepository.getAll();
    sendPayload(res, 200, carts);
  }

  // CREATE CART
  createCart = async (req, res) => {
    const cart = await cartRepository.createCart();
    sendPayload(res, 200, cart);
  }

  // GET PRODUCTS FROM CART
  getOneCart = async (req, res) => {
    const { cid } = req.params;
    if (!cid) return sendError(res, 400, 'Bad Request');
    const response = await cartRepository.getOneCart(cid);
    response !== 'CastError' || !response
      ? sendPayload(res, 200, response.products)
      : sendError(res, 400, 'Cart not found');
  }

  // BUY CART

  buyCart = async (req, res) => {
    const { email } = req.body;
    const { cid } = req.params;
    const { products } = await cartRepository.getOneCart(cid);
    if (!products) return sendError(res, 400, 'Cart not found');
    if (products.length === 0) return sendError(res, 400, 'Cart is empty');
    let productsNotBought = products.filter(prod => prod.product.stock < prod.quantity);
    let productsToBuy = products.filter(prod => prod.product.stock >= prod.quantity);
    for(const prod of productsToBuy) {
      await productRepository.updateProduct(prod.product._id, { ...prod.product, stock: prod.product.stock - prod.quantity });
    }
    await cartRepository.setProductsToCart(cid, productsNotBought);
    let amount = productsToBuy.reduce((acc, prod) => acc + prod.product.price * prod.quantity, 0);
    let ticketResponse = await ticketRepository.create({ code:generateUUID(), purchase_datetime: new Date(), amount, purchase_user: email });
    sendPayload(res, 200, ticketResponse);
  }

  // DELETE PRODUCTS FROM CART
  deleteAllProductsToCart = async (req, res) => {
    const { cid } = req.params;
    if (!cid) return sendError(res, 400, 'Bad Request');
    const response = await cartRepository.deleteAllProductsToCart(cid);
    response === 'No se encontro el carrito'
      ? sendPayload(res, 200, response)
      : sendError(res, 400, response);
  }

  // SET PRODUCTS TO CART
  setProductsToCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    let responseCart = await cartRepository.getOneCart(cid);
    if (!responseCart || responseCart === 'CastError') return sendError(res, 400, 'Cart not found');
    for(const prod of products) {
      if(!prod.hasOwnProperty('product') || !prod.hasOwnProperty('quantity') || typeof(prod.quantity) !== "number"){
        return sendError(res, 400, 'Wrong fields');
      }
      let existProd = await productRepository.findProduct(prod.product);
      if(existProd.length === 0) return sendError(res, 400, `Product '${prod}' not found`);
    }
    await cartRepository.setProductsToCart(cid, products);
    sendPayload(res, 200, 'Cart modified successfully');
  }

  // ADD PRODUCT TO CART
  addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { email } = req.user;
    const cartFind = await cartRepository.getOneCart(cid);
    const prodFind = await productRepository.findProduct(pid);
    if (!cartFind || cartFind === 'CastError') {
      return sendError(res, 400, 'Cart not found');
    }
    else if (prodFind.length === 0 || prodFind === 'CastError') {
      return sendError(res, 400, 'Product not found');
    }
    if(prodFind.owner === email) return sendError(res, 403, "You can't buy this product");
    let responseAddProduct = await cartRepository.addProductToCart(cid, pid);
    sendPayload(res, 200, responseAddProduct);
  }

  // DELETE PRODUCT TO CART
  deleteProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    let cartFind = await cartRepository.getOneCart(cid);
    let productFind = await productRepository.findProduct(pid);
    if (!cartFind || cartFind === 'CastError') {
      return sendError(res, 400, 'Cart not found');
    }
    else if (productFind.length === 0 || productFind === 'CastError') {
      return sendError(res, 400, 'Product not found');
    }
    let responseDeleteProduct = await cartRepository.deleteProductToCart(cid, pid);
    sendPayload(res, 200, responseDeleteProduct);
  }

  // SET QUANTITY PRODUCT
  updateQuantityProduct = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    let response = await cartRepository.updateQuantityProduct(cid, pid, Number(quantity));
    sendPayload(res, 200, response);
  }

}

export default new CartController();