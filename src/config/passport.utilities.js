import passport from "passport";
import { sendError } from "../utils.js";

// COOKIE EXTRACTOR
export const cookieExtractor = req => {
  let token;
  if (req && req.cookies) token = req.cookies['authCookie'];
  return token;
}

// CUSTOM PASSPORT

export const passportAuth = (strategy, options) => async (req, res, next) => {
  passport.authenticate(strategy, { ...options }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return sendError(res, 401, info ? info.messages??info.toString() : 'Unauthorized');
    req.user = user;
    next();
  })(req, res, next);
}