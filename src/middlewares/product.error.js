import enumErrors from '../errors/enum.errors.js';
import { sendError } from '../utils.js';

const sendCustomError = (res, statusCode, error) => {
  res.status(statusCode).send({ error: { name: error.name, cause: error.cause } });
}

export default (err, req, res, next) => {
  const codeErrorExist = Object.values(enumErrors).includes(err.code);
  return codeErrorExist ? sendCustomError(res, 400, err) : sendError(res, 400, 'Unhandled error');
} 