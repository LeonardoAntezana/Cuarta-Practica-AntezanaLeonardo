import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import GithubStrategy from 'passport-github2';
import userRepository from '../models/repositories/user.repository.js';
import cartRepository from '../models/repositories/cart.repository.js';
import UserDto from '../models/dtaos/user.dto.js'
import { generateHash, isValidPassword } from '../utils.js'
import { cookieExtractor } from './passport.utilities.js';
import keys from '../config/config.env.js';

const initializePassport = () => {
  // GITHUB STRATEGY
  passport.use('github', new GithubStrategy({
    clientID: keys.CLIENT_ID,
    clientSecret: keys.CLIENT_SECRET,
    callbackURL: keys.CALLBACK_URL,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userRepository.getOneUser({ email: profile._json.email })
      if (!user) {
        let { _id } = await cartRepository.createCart();
        let auxUser = {
          first_name: profile._json.name,
          last_name: '',
          email: profile._json.email,
          age: '',
          password: '',
          cart: _id,
          role: 'user'
        }
        let response = await userRepository.createUser(auxUser);
        done(null, new UserDto(response));
      }
      else {
        done(null, new UserDto(user));
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
      return done(null, new UserDto(jwt_payload));
    } catch (error) {
      return done(error, false);
    }
  }))
  // PASSPORT - LOCAL - REGISTER
  passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
      try {
        let { first_name, last_name, email, age } = req.body;
        if (!first_name || !last_name || !email || !age) return done(null, false);
        let user = await userRepository.getOneUser({ email: username });
        if (user) return done(null, false);
        let { _id } = await cartRepository.createCart();
        let auxUser = { first_name, last_name, email, age, password: generateHash(password), cart: _id };
        let response = await userRepository.createUser(auxUser);
        done(null, response)
      } catch (error) {
        return done(error);
      }
    }))
  // PASSPORT - LOCAL - LOGIN
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' }, async (username, password, done) => {
      try {
        if (username === keys.ADMIN_EMAIL && password === keys.ADMIN_PASSWORD) {
          let adminUser = { first_name: username, role: 'admin' };
          return done(null, adminUser);
        }
        let user = await userRepository.getOneUser({ email: username })
        if (!user) return done(null, false, 'No user found');
        if (!isValidPassword(password, user.password)) return done(null, false, 'Invalid password');
        delete user._doc.password;
        done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ))
  passport.serializeUser((user, done) => done(null, user._id || user.role))

  passport.deserializeUser(async (id, done) => {
    let user = await userRepository.getOneUser({ _id: id });
    done(null, user);
  })

}

export default initializePassport;