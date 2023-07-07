import { cartModel } from "../models/cart.model.js";

export default class Carts {

  constructor() { }

  getAll = async () => {
    let carts = await cartModel.find();
    return carts;
  }

  createCart = async () => {
    let responseCreate = await cartModel.create({ products: [] })
    return responseCreate;
  }

  getOneCart = async (id) => {
    let responseFind = await cartModel.findOne({ _id: id })
    return responseFind;
  }

  addProductToCart = async (id, productId) => {
    let existProductInCart = await cartModel.find({
      _id: id, products: {
        $elemMatch: { product: productId }
      }
    });
    if (existProductInCart) {
      await cartModel.updateOne({ _id: id, "products.product": productId }, {
        $inc: { "products.$.quantity": 1 }
      })
      return 'producto agregado!'
    }
    await cartModel.updateOne({ _id: id }, { $addToSet: { products: { product: productId, quantity: 1 } } });
    return 'Se ha agregado una unidad mas del producto';
  }

}