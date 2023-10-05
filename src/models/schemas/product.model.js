import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'Products';

const productSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    default: 'admin'
  }
})

productSchema.plugin(mongoosePaginate);

export const productModel = model(productsCollection, productSchema);