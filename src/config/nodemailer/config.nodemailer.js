import { createTransport } from "nodemailer";
import { GOOGLE_AUTHS } from "../config.env.js";

class ManagerMailer {

  static #instance;
  #transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: GOOGLE_AUTHS.USER_EMAIL,
      pass: GOOGLE_AUTHS.USER_PASSWORD
    }
  })

  static getInstance = () => {
    if (!ManagerMailer.#instance) {
      ManagerMailer.#instance = new ManagerMailer();
    }
    return ManagerMailer.#instance;
  }

  sendEmail = async ({ to, subject, html, attachments = [] }) => {
    let response = await this.#transport.sendMail({
      from: GOOGLE_AUTHS.USER_EMAIL,
      to,
      subject,
      html,
      attachments
    })
    return response;
  }
}

export default ManagerMailer;