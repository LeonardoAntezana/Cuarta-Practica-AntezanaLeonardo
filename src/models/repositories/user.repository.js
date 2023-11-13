import daos from "../dao.factory.js";

class UserRepository {
  constructor() {
    this.dao = daos.userDao;
  }

  getOneUser = async (filter) => await this.dao.getOneUser(filter);

  getAll = async () => await this.dao.getAll();

  createUser = async (newUser) => await this.dao.createUser(newUser);

  deleteUser = async (filter) => await this.dao.deleteUser(filter);

  updatePassWord = async (email, newPassword) => await this.dao.updatePassWord(email, newPassword);

  updateRole = async (uid, newRole) => await this.dao.updateRole(uid, newRole);

  updateLastConnection = async (uid) => await this.dao.updateLastConnection(uid);

  updateDocuments = async (uid, arrayDocuments) => await this.dao.updateDocuments(uid, arrayDocuments);

}

export default new UserRepository();