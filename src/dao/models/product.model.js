import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'Products';

const productSchema = Schema({
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

productSchema.plugin(mongoosePaginate);

export const productModel = model(productsCollection, productSchema);