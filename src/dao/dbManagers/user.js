import { userModel } from '../models/user.model.js'

export default class Users {

  constructor() { }

  getOneUser = async (filter) => {
    let user = await userModel.findOne({ ...filter });
    return user;
  }

  createUser = async (newUser) => {
    try {
      let response = await userModel.create(newUser);
      return response;
    } catch (error) {
      return error;
    }
  }

}