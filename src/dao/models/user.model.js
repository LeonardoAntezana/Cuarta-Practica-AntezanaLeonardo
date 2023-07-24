import { Schema, model } from "mongoose";

const userCollection = 'Users'

const userSchema = Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: String,
  password: String
})

export const userModel = model(userCollection, userSchema);