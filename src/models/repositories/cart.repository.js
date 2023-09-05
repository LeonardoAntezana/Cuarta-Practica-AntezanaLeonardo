import daos from "../dao.factory.js";

class CartRepository {
  constructor() {
    this.dao = daos.cartDao;
  }

  getAll = async () => await this.dao.getAll();
  
  createCart = async () => await this.dao.createCart();
  
  getOneCart = async (id) => await this.dao.getOneCart(id);

  buyCart = async (id, products) => await this.dao.buyCart(id, products);

  deleteAllProductsToCart = async (cid) => await this.dao.deleteAllProductsToCart(cid);

  addProductToCart = async (id, productId) => await this.dao.addProductToCart(id, productId);
  
  deleteProductToCart = async (cid, productId) => await this.dao.deleteProductToCart(cid, productId);

  updateQuantityProduct = async (cid, productId, newQuantity) => await this.dao.updateQuantityProduct(cid, productId, newQuantity);

  setProductsToCart = async (cid, arrayProducts) => await this.dao.setProductsToCart(cid, arrayProducts);

}

export default new CartRepository();