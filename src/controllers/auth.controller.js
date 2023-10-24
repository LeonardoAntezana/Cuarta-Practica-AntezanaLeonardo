import { sendPayload, sendError, generateToken } from "../utils.js";
import userRepository from "../models/repositories/user.repository.js";

class AuthController {

  githubCallback = async (req, res) => {
    let { first_name, last_name, role, cart, email } = req.user;
    const userResponse = await userRepository.getOneUser({ email });
    if (userResponse) await userRepository.updateLastConnection(userResponse._id);
    req.session.user = { name: `${first_name} ${last_name || ''}`, role, cart, email };
    let token = generateToken({ first_name, last_name, role }, '10h');
    res.cookie('authCookie', token, { httpOnly: true });
    res.redirect('/')
  }

  register = (req, res) => {
    sendPayload(res, 200, 'User registed');
  }

  login = async (req, res) => {
    try {
      let { first_name, last_name, role, cart, email } = req.user;
      const userResponse = await userRepository.getOneUser({ email });
      if (userResponse) await userRepository.updateLastConnection(userResponse._id);
      req.session.user = { name: `${first_name} ${last_name || ''}`, role, cart, email };
      let token = generateToken({ ...req.session.user }, '10h');
      res.cookie('authCookie', token, { httpOnly: true });
      if (role === 'admin') return sendPayload(res, 200, 'Admin logeado')
      sendPayload(res, 200, 'Usuario logeado')
    } catch (error) {
      sendError(res, 400, error);
    }
  }

  logout = async (req, res) => {
    try {
      req.session.destroy(err => {
        if (err) return sendError(res, 400, err);
      });
      const userResponse = await userRepository.getOneUser({ email: req.user.email });
      if (userResponse) await userRepository.updateLastConnection(userResponse._id);
      res.clearCookie('connect.sid')
      res.clearCookie('authCookie')
      res.redirect('/login')
    } catch (error) {
      sendError(res, 400, error);
    }
  }

}

export default new AuthController();