import messageService from '../services/message.service.js';
import { sendError, sendPayload } from '../utils.js';

const messageInstance = messageService.getInstance();

class ChatController {

  getAll = async (req, res) => {
    const messages = await messageInstance.getAll();
    sendPayload(res, 200, messages);
  }

  addMessage = async (req, res) => {
    let { user, message } = req.body;
    if(!user || !message) return sendError(res, 400, 'Fields incompletes');
    const response = await messageInstance.addMessage({ user, message });
    sendPayload(res, 200, response);
  }

}

export default new ChatController();