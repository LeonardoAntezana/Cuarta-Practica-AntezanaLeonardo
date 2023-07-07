import { messageModel } from '../models/message.model.js'

export default class Messages {

  constructor(){}

  getAll = async () => {
    let messages = await messageModel.find();
    return messages;
  }

}