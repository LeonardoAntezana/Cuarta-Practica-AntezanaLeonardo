import { sendPayload, sendError, generateToken } from "../utils.js";

class AuthController {

  githubCallback = (req, res) => {
    let { first_name, last_name, role, cart, email } = req.user;
    req.session.user = { name: `${first_name} ${last_name || ''}`, role, cart, email };
    let token = generateToken({ first_name, last_name, role }, '10h');
    res.cookie('authCookie', token, { httpOnly: true });
    res.redirect('/')
  }

  register = (req, res) => {
    sendPayload(res, 200, 'User registed');
  }

  login = (req, res) => {
    try {
      let { first_name, last_name, role, cart, email } = req.user;
      req.session.user = { name: `${first_name} ${last_name || ''}`, role, cart, email };
      let token = generateToken({ ...req.session.user }, '10h');
      res.cookie('authCookie', token, { httpOnly: true });
      if (role === 'admin') return sendPayload(res, 200, 'Admin logeado')
      sendPayload(res, 200, 'Usuario logeado')
    } catch (error) {
      sendError(res, 400, error);
    }
  }

  logout = (req, res) => {
    req.session.destroy(err => {
      if (err) return sendError(res, 400, err);
    });
    res.clearCookie('connect.sid')
    res.clearCookie('authCookie')
    res.redirect('/login')
  }

}

export default new AuthController();