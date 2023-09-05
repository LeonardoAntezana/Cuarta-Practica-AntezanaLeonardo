import { messageModel } from "../../schemas/message.model.js";

export default class MessageDao {
  getAll = async () => {
    let messages = await messageModel.find().lean();
    return messages;
  }

  addMessage = async (newMessage) => {
    try {
      let resAdd = await messageModel.create(newMessage)
      return resAdd;
    } catch(error) {
      return error;
    }
  }

}