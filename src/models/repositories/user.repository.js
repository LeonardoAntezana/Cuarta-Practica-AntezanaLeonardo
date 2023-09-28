import daos from "../dao.factory.js";

class UserRepository {
  constructor() {
    this.dao = daos.userDao;
  }

  getOneUser = async (filter) => await this.dao.getOneUser(filter);

  createUser = async (newUser) => await this.dao.createUser(newUser);

  updatePassWord = async (email, newPassword) => await this.dao.updatePassWord(email, newPassword);

  updateRole = async (uid, newRole) => await this.dao.updateRole(uid, newRole);

}

export default new UserRepository();