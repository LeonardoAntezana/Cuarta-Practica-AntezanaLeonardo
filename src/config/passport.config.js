import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import GithubStrategy from 'passport-github2';
import { userDbManager, cartsDbManager } from '../app.js';
import { generateHash, isValidPassword } from '../utils.js'
import { cookieExtractor } from './passport.utilities.js';

const initializePassport = () => {
  // GITHUB STRATEGY
  passport.use('github', new GithubStrategy({
    clientID: 'Iv1.80c489416ea9869e',
    clientSecret: '770320c7529c2d72510e34ac0ea6af13435b1990',
    callbackURL: 'http://localhost:8080/api/auth/githubcallback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userDbManager.getOneUser({ email: profile._json.email })
      if (!user) {
        let { _id } = await cartsDbManager.createCart();
        let auxUser = {
          first_name: profile._json.name,
          last_name: '',
          email: profile._json.email,
          age: '',
          password: '',
          cart: _id,
        }
        let response = await userDbManager.createUser(auxUser);
        done(null, response);
      }
      else {
        done(null, user)
      }
    } catch (error) {
      return done(error);
    }
  }))
  // PASSPORT JWT
  passport.use('current', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
    secretOrKey: 'Farah',
  }, async (jwt_payload, done) => {
    try {
      return done(null, jwt_payload);
    } catch (error) {
      return done(error);
    }
  }))
  // PASSPORT - LOCAL - REGISTER
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      try {
        let { first_name, last_name, email, age } = req.body;
        if (!first_name || !last_name || !email || !age) return done(null, false);
        let user = await userDbManager.getOneUser({ email: username });
        if (user) return done(null, false);
        let { _id } = await cartsDbManager.createCart();
        let auxUser = { first_name, last_name, email, age, password: generateHash(password), cart: _id };
        let response = await userDbManager.createUser(auxUser);
        done(null, response)
      } catch (error) {
        return done(error);
      }
    }))
  // PASSPORT - LOCAL - LOGIN
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' }, async (username, password, done) => {
      try {
        if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
          let adminUser = { first_name: username, role: 'admin' };
          return done(null, adminUser);
        }
        let user = await userDbManager.getOneUser({ email: username })
        if (!user) return done(null, false, 'No user found');
        if (!isValidPassword(password, user.password)) return done(null, false, 'Bad password');
        delete user._doc.password;
        done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ))
  passport.serializeUser((user, done) => done(null, user._id || 111))

  passport.deserializeUser(async (id, done) => {
    let user = await userDbManager.getOneUser({ _id: id });
    done(null, user);
  })

}

export default initializePassport;