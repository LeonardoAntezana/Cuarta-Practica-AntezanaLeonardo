import { cartModel } from "../src/models/schemas/cart.model.js";
import { productModel } from "../src/models/schemas/product.model.js";
import { userModel } from "../src/models/schemas/user.model.js";

export const dropCarts = async () => await cartModel.collection.drop(); 
export const dropProducts = async () => await productModel.collection.drop();
export const dropUsers = async () => await userModel.collection.drop();