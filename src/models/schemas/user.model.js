import { Schema, model } from "mongoose";

const userCollection = 'Users'

const userSchema = Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  cart: {
    type: Schema.Types.ObjectId,
    ref: 'Carts',
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'premium'],
    default: 'user'
  },
  documents: [
    {
      name: String,
      reference: String
    }
  ],
  last_connection: {
    type: Date,
    required: true
  },
})

export const userModel = model(userCollection, userSchema);