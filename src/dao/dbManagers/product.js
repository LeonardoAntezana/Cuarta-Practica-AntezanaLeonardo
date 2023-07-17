import { productModel } from "../models/product.model.js";

export default class Products {

  constructor() { }

  getAll = async () => {
    let products = await productModel.find().lean();
    return products;
  }

  getAllPaginate = async (limit, page, field, sort, query) => {
    let sortVerify = sort && { sort: { [field]: sort } }
    try {
      let products = await productModel.paginate(query, { ...sortVerify, limit, page, lean: true })
      return products;
    } catch(TypeError){
      return 'Invalid value sort'
    } 
  }

  findProduct = async (id) => {
    try {
      let prod = await productModel.find({ _id: id }).lean();
      return prod;
    } catch (error) {
      return error.name;
    }
  }

  addProduct = async (product) => {
    try {
      let responseCreate = await productModel.create(product)
      return responseCreate;
    } catch (error) {
      return error;
    }
  }

  updateProduct = async (id, newProps) => {
    try {
      let responseUpdate = await productModel.updateOne({ _id: id }, { $set: { ...newProps } })
      return responseUpdate;
    } catch (error) {
      return error.name;
    }
  }

  deleteProduct = async (id) => {
    try {
      let responseDelete = await productModel.deleteOne({ _id: id })
      return responseDelete;
    } catch (error) {
      return error.name;
    }
  }

}