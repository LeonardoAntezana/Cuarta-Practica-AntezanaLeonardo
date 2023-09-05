import daos from "../dao.factory.js";

class UserRepository {
  constructor() {
    this.dao = daos.userDao;
  }

  getOneUser = async (filter) => await this.dao.getOneUser(filter);

  createUser = async (newUser) => await this.dao.createUser(newUser);

}

export default new UserRepository();