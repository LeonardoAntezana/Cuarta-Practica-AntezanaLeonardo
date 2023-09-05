import daos from "../dao.factory.js";

class MessageRepository {
  constructor() {
    this.dao = daos.messageDao;
  }

  getAll = async () => await this.dao.getAll();

  addMessage = async (newMessage) => await this.dao.addMessage(newMessage);

}

export default new MessageRepository();