import passport from 'passport';
import GithubStrategy from 'passport-github2';
import { userDbManager } from '../app.js';

const initializePassport = () => {
  passport.use('github', new GithubStrategy({
    clientID: 'Iv1.80c489416ea9869e',
    clientSecret: '770320c7529c2d72510e34ac0ea6af13435b1990',
    callbackURL: 'http://localhost:8080/api/auth/githubcallback', 
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userDbManager.getOneUser({ email: profile._json.email })
      if (!user) {
        let auxUser = {
          first_name: profile._json.name,
          last_name: '',
          email: profile._json.email,
          age: '',
          password: ''
        }
        let response = await userDbManager.createUser(auxUser);
        done(null, response);
      }
      else { done(null, user) }
    } catch (error) {
      return done(error);
    }
  }))


  passport.serializeUser((user, done) => done(null, user._id))

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  })

}

export default initializePassport;