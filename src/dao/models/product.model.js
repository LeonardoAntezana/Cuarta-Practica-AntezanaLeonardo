import mongoose from "mongoose";

const productsCollection = 'products';

const productSchema = mongoose.Schema({
  title: String,
  description: String,
  code: {
    type: String,
    unique: true,
  },
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
})

export const productModel = mongoose.model(productsCollection, productSchema);