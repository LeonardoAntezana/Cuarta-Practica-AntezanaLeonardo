import { messageModel } from "../dao/models/message.model.js";

class MessageService {

  static #instance;

  static getInstance() {
    if (!MessageService.#instance) {
      MessageService.#instance = new MessageService();
    }
    return MessageService.#instance;
  }

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

export default MessageService;