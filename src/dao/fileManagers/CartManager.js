import { existsSync, promises } from 'fs'

export class CartManager {

  constructor(path) {
    this.path = path;
  }

  getCarts = async () => {
    try {
      const carts = await promises.readFile(this.path, 'utf-8')
      return JSON.parse(carts);
    }
    catch {
      return [];
    }
  };

  createCart = async () => {
    if (existsSync(this.path)) {
      const carts = await this.getCarts();
      await promises.writeFile(this.path, JSON.stringify([...carts, { id: carts[carts.length - 1].id + 1, products: [] }], null, '\t'))
    }
    else {
      await promises.writeFile(this.path, JSON.stringify([{ id: 0, products: [] }], null, '\t'));
    }
    return 'Carrito creado con exito!';
  }

  getCartById = async (id) => {
    if (existsSync(this.path)) {
      const carts = await this.getCarts();
      let cartSearch = carts.find(c => c.id === id)
      return cartSearch;
    }
  }

  deleteCartById = async (id) => {
    if (existsSync(this.path)) {
    const carts = await this.getCarts();
    let filterCart = carts.filter(c => c.id !== id)
    await promises.writeFile(this.path, JSON.stringify([...filterCart], null, '\t'));
    return 'Carrito eliminado';
    }
    return 'No existe el carrito con ese id'
  }

  addProductToCart = async (idCart, productId) => {
    const allCarts = await this.getCarts();
    const cart = allCarts.find(cart => cart.id === idCart);
    let productFind = cart.products.find(prod => prod.product === productId);
    if(productFind){
      productFind.quantity += 1;
      cart.products = [...cart.products];
      await promises.writeFile(this.path, JSON.stringify([...allCarts], null, '\t'));
      return 'Producto existente, se ha sumado una unidad mas';
    }
    cart.products = [...cart.products, {product: productId, quantity: 1}];
    await promises.writeFile(this.path, JSON.stringify([...allCarts], null, '\t'));
    return 'Producto agregado con exito';
  }

}