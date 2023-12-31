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
  documents: {
    type: [
      {
        name: String,
        reference: String
      }
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    required: true,
    default: new Date()
  },
})

export const userModel = model(userCollection, userSchema);