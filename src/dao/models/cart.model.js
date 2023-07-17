import { Schema, model } from "mongoose";

const cartCollection = 'Carts';

const cartSchema = Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Products',
        },
        quantity: Number,
      }
    ],
    default: [],
  }
})

export const cartModel = model(cartCollection, cartSchema);