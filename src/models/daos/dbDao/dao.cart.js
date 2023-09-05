import { cartModel } from "../../schemas/cart.model.js";

export default class CartDao {

  getAll = async () => {
    let carts = await cartModel.find().populate('products.product').lean();
    return carts;
  }

  createCart = async () => {
    let newCart = await cartModel.create({ products: [] })
    return newCart;
  }

  getOneCart = async (id) => {
    try {
      let responseFind = await cartModel.findOne({ _id: id }).populate('products.product').lean()
      return responseFind;
    } catch (error) {
      return error.name;
    }
  }

  deleteAllProductsToCart = async (cid) => {
    let { matchedCount } = await cartModel.updateOne({ _id: cid }, { $set: { products: [] } });
    return matchedCount === 0 ? 'No se encontro el carrito' : 'Productos eliminados';
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

  deleteProductToCart = async (cid, productId) => {
    let { modifiedCount } = await cartModel.updateOne({ _id: cid }, { $pull: { products: { product: productId } } });
    return modifiedCount === 0 ? 'No se ha encontrado el producto en el carrito' : 'Producto eliminado del carrito';
  }

  updateQuantityProduct = async (cid, productId, newQuantity) => {
    let existProductInCart = await cartModel.findOne({
      _id: cid, products: {
        $elemMatch: { product: productId }
      }
    });
    if (existProductInCart) {
      await cartModel.updateOne({ _id: cid, "products.product": productId }, {
        $set: { "products.$.quantity": newQuantity }
      });
      return 'Se ha modificado el producto exitosamente';
    }
    return 'No se encontro el producto en el carrito';
  }

  setProductsToCart = async (cid, arrayProducts) => {
    await cartModel.updateOne({ _id: cid }, { $set: { products: arrayProducts } })
  }
}