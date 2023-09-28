import userRepository from "../models/repositories/user.repository.js";
import ManagerMailer from "../config/nodemailer/config.nodemailer.js";
import { sendPayload, sendError, isValidPassword, generateHash } from "../utils.js";

class UserController {

  updatePassword = async (req, res) => {
    const { password } = req.body;
    let email = res.cookie.authRecover;
    if (!password) return sendError(res, 400, 'Campos incompletos');
    let user = await userRepository.getOneUser({ email });
    if (!user) return sendError(res, 400, 'Usuario no encontrado');
    if (isValidPassword(password, user.password)) return sendError(res, 400, 'No se puede colocar la misma contraseña');
    await userRepository.updatePassWord(email, generateHash(password));
    res.clearCookie('authRecover');
    sendPayload(res, 200, 'Contraseña actualizada');
  }

  updateRole = async (req, res) => {
    const { uid } = req.params;
    if (!uid) return sendError(res, 400, 'Campos incompletos');
    let user = await userRepository.getOneUser({ _id: uid });
    if (!user) return sendError(res, 400, 'Usuario no encontrado');
    let newRole = user.role === 'user' ? 'premium' : 'user';
    const response = await userRepository.updateRole(uid, newRole);
    sendPayload(res, 200, response);
  }

  sendEmail = async (req, res) => {
    const { email } = req.body;
    let mailer = ManagerMailer.getInstance();
    let user = await userRepository.getOneUser({ email });
    if (!user) return sendError(res, 400, 'Usuario no encontrado');
    let response = await mailer.sendEmail({
      to: email,
      subject: 'Recuperacion de contraseña',
      html: `<div>
              <a href="http://localhost:8080/recoverpassword">Ingrese a este link para recuperar contraseña</a>
            </div>`,
    });
    res.cookie('authRecover', email, { maxAge: 3600000 });
    sendPayload(res, 200, response);
  }

}

export default new UserController();