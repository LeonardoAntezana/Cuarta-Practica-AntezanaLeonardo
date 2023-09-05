import messageRepository from '../models/repositories/messages.repository.js';
import { sendError, sendPayload } from '../utils.js';

class ChatController {

  getAll = async (req, res) => {
    const messages = await messageRepository.getAll();
    sendPayload(res, 200, messages);
  }

  addMessage = async (req, res) => {
    let { user, message } = req.body;
    if(!user || !message) return sendError(res, 400, 'Fields incompletes');
    const response = await messageRepository.addMessage({ user, message });
    sendPayload(res, 200, response);
  }

}

export default new ChatController();