import { userModel } from '../dao/models/user.model.js';

class UserService {

  static #instance;

  static getInstance() {
    if (!UserService.#instance) {
      UserService.#instance = new UserService();
    }
    return UserService.#instance;
  }

  getOneUser = async (filter) => {
    try {
      let user = await userModel.findOne({ ...filter });
      return user;
    } catch (error) {
      return error;
    }
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

export default UserService;