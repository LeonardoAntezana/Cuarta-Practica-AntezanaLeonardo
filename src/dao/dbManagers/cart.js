import { cartModel } from "../models/cart.model.js";

export default class Carts {

  constructor() { }

  getAll = async () => {
    let carts = await cartModel.find().lean();;
    return carts;
  }

  createCart = async () => {
    await cartModel.create({ products: [] })
    return 'Nuevo carrito creado';
  }

  getOneCart = async (id) => {
    try {
      let responseFind = await cartModel.findOne({ _id: id })
      return responseFind;
    } catch (error) {
      return error.name;
    }
  }

  addProductToCart = async (id, productId) => {
    let existProductInCart = await cartModel.findOne({
      _id: id, products: {
        $elemMatch: { product: productId }
      }
    });
    if (existProductInCart) {
      await cartModel.updateOne({ _id: id, "products.product": productId }, {
        $inc: { "products.$.quantity": 1 }
      })
      return 'Se ha agregado una unidad mas del producto!'
    }
    await cartModel.updateOne({ _id: id }, { $addToSet: { products: { product: productId, quantity: 1 } } });
    return 'Producto agregado';
  }

}