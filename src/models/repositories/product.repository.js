import daos from '../dao.factory.js';

class ProductRepository {
  constructor() {
    this.dao = daos.productDao;
  }

  getAll = async () => await this.dao.getAll();

  getAllPaginate = async (limit, page, field, sort, query) => await this.dao.getAllPaginate(limit, page, field, sort, query);

  findProduct = async (id) => await this.dao.findProduct(id);

  findProductByCode = async (code) => await this.dao.findProductByCode(code);

  addProduct = async (product) => await this.dao.addProduct(product);

  updateProduct = async (id, newProps) => await this.dao.updateProduct(id, newProps);

  deleteProduct = async (id) => await this.dao.deleteProduct(id);

}

export default new ProductRepository();