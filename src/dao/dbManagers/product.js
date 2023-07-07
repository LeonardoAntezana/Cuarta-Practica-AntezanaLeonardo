import { productModel } from "../models/product.model";

export default class Products {

  constructor() { }

  getAll = async () => {
    let products = await productModel.find();
    return products;
  }

  addProduct = async (product) => {
    let responseCreate = await productModel.create(product)
    return responseCreate;
  }

  updateProduct = async (id, newProps) => {
    let responseUpdate = await productModel.updateOne({ _id: id }, { $set: { ...newProps } })
    return responseUpdate;
  }

  deleteProduct = async (id) => {
    let responseDelete = await productModel.deleteOne({ _id: id })
    return responseDelete;
  }

}