import userRepository from "../models/repositories/user.repository.js";
import ManagerMailer from "../config/nodemailer/config.nodemailer.js";
import { sendPayload, sendError, isValidPassword, generateHash } from "../utils.js";
import { userFormat, checkLastConnection } from "./utils/utils.controller.js";

class UserController {

  getAll = async (_req, res) => {
    let users = await userRepository.getAll();
    let usersFormatted = users.map(userFormat);
    sendPayload(res, 200, usersFormatted);
  }

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
    if (user.role === 'premium') {
      await userRepository.updateRole(uid, 'user');
      return sendPayload(res, 200, 'Usuario actualizado');
    }
    let existDocuments = user.documents.filter(doc => {
      let formatName = doc.name.toLowerCase();
      return formatName.includes('identificacion') || formatName.includes('comprobante de domicilio') || formatName.includes('comprobante de estado de cuenta');
    });
    if (existDocuments.length !== 3) return sendError(res, 400, 'Falta documentacion para ser premium');
    await userRepository.updateRole(uid, 'premium');
    sendPayload(res, 200, 'Usuario actualizado');
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

  updateDocuments = async (req, res) => {
    const { uid } = req.params;
    if (!req.files) return sendError(res, 400, 'No hay archivos');
    if (!uid) return sendError(res, 400, 'parametro uid es requerido');
    const searchedUser = await userRepository.getOneUser({ _id: uid });
    if (!searchedUser) return sendError(res, 400, 'Usuario no encontrado');
    let formatFiles = req.files.map(({ originalname, destination }) => {
      let path = destination.split('/');
      return { name: originalname, reference: `/public/img/${path[path.length - 1]}/${originalname}` }
    });
    await userRepository.updateDocuments(uid, formatFiles);
    sendPayload(res, 200, 'Documentos actualizados');
  }

  deleteUser = async (req, res) => {
    const { uid } = req.params;
    if (!uid) return sendError(res, 400, 'parametro uid es requerido');
    let user = await userRepository.getOneUser({ _id: uid });
    if (!user) return sendError(res, 400, 'Usuario no encontrado');
    await userRepository.deleteUser({ _id: uid });
    sendPayload(res, 200, 'Usuario eliminado');
  }

  deleteAll = async (_req, res) => {
    let actualDate = new Date(), diferenceDays = 2;
    let users = await userRepository.getAll();
    if (users.length === 0) return sendPayload(res, 200, 'No hay usuarios para eliminar');
    users.forEach(async ({ email, last_connection }) => {
      if (checkLastConnection(last_connection, actualDate, diferenceDays)) {
        await userRepository.deleteUser({ email });
        let mailer = ManagerMailer.getInstance();
        await mailer.sendEmail({
          to: email,
          subject: 'Se ha eliminado su cuenta por motivo de inactividad',
        });
      }
    })
    sendPayload(res, 200, 'Cuentas eliminadas');
  }

}

export default new UserController();