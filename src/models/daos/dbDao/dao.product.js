import { productModel } from '../../schemas/product.model.js';

export default class ProductDao {
  getAll = async () => {
    try {
      let products = await productModel.find().lean();
      return products;
    } catch (error) {
      return error;
    }
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
      let prod = await productModel.findOne({ _id: id }).lean();
      return prod;
    } catch (error) {
      return error.name;
    }
  }

  findProductByCode = async (code) => {
    try {
      let prod = await productModel.findOne({ code }).lean();
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