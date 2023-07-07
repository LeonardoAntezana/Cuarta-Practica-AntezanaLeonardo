import { existsSync, promises } from 'fs'

export class ProductManager {

  constructor(name, path) {
    this.name = name;
    this.path = path;
  }

  getProducts = async () => {
    try {
      const productsFile = await promises.readFile(this.path, 'utf-8')
      return JSON.parse(productsFile);
    }
    catch {
      return [];
    }
  };

  addProduct = async (title, description, code, price, status = true, stock, category) => {
    if (existsSync(this.path)) {
      const products = await this.getProducts();
      const productExist = products.some(prod => prod.code === code);
      if (productExist) {
        return 'El producto con ese code ya existe!'
      }

      await promises.writeFile(this.path, JSON.stringify(
        [...products, { id: products[products.length - 1].id + 1, title, description, code, price, status, stock, category }]
        , null,
        '\t'
      ));

    }
    else {
      await promises.writeFile(this.path, JSON.stringify([{ id: 0, title, description, code, price, status, stock, category }], null, '\t'))
    }
    return 'Producto agregado!';
  }

  getProductById = async (id) => {
    const products = await this.getProducts();
    let productFind = products.find(prod => prod.id === id);
    return productFind;
  }

  // UPDATE PRODUCT
  updateProduct = async (idProd, newProduct) => {
    const products = await this.getProducts();
    let indexProduct = products.findIndex(prod => prod.id === idProd);
    products[indexProduct] = { ...products[indexProduct], ...newProduct };
    await promises.writeFile(this.path, JSON.stringify([...products], null, '\t'))
    return 'Producto actualizado con exito'
  }

  // DELETE PRODUCT
  deleteProduct = async (id) => {
    const products = await this.getProducts();
    if (products.some(prod => prod.id === id)) {
      const filterProducts = products.filter(prod => prod.id !== id)
      await promises.writeFile(this.path, JSON.stringify(filterProducts, null, '\t'));
      return 'Producto eliminado!'
    }
    return 'El producto a eliminar no existe!';
  }

}