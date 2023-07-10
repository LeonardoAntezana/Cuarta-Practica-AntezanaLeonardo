import { messageModel } from '../models/message.model.js'

export default class Messages {

  constructor() { }

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