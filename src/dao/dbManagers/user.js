import { userModel } from '../models/user.model.js'

export class Users {

  constructor() { }

  getOneUser = async (filter) => {
    let user = await userModel.findOne({ ...filter });
    return user;
  }

  createUser = async (newUser) => {
    try {
      await userModel.create(newUser);
      return 'User created!'
    } catch (error) {
      return error;
    }
  }

}