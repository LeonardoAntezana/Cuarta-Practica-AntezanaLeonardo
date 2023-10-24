import { userModel } from '../../schemas/user.model.js'

export default class UserDao {

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

  updatePassWord = async (email, newPassword) => {
    try {
      let response = await userModel.updateOne({ email }, { password: newPassword });
      return response;
    } catch (error) {
      return error;
    }
  }

  updateRole = async (uid, newRole) => {
    try {
      let response = await userModel.updateOne({ _id: uid }, { role: newRole });
      return response;
    } catch (error) {
      return error;
    }
  }

  updateLastConnection = async (uid) => {
    try {
      let response = await userModel.updateOne({ _id: uid }, { last_connection: new Date() });
      return response;
    } catch (error) {
      return error;
    }
  }

  updateDocuments = async (uid, arrayDocuments) => {
    try {
      let response = await userModel.updateOne({ _id: uid }, { $addToSet: { documents: { $each: arrayDocuments } } });
      return response;
    } catch (error) {
      return error;
    }
  }

}