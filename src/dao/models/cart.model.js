import mongoose from "mongoose";

const cartCollection = 'carts';

const cartSchema = mongoose.Schema({
  products: [],
})

export const cartModel = mongoose.model(cartCollection, cartSchema);