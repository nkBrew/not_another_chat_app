import passport from 'passport';
import { Strategy } from 'passport-local';
// import users from './users';
import { comparePassword, findUser, findUserById } from './users';

passport.serializeUser((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id: string, done) => {
  const user = findUserById(id);
  console.log(user);

  return done(null, user);
});

passport.use(
  new Strategy({ usernameField: 'email' }, (email, password, done) => {
    const user = findUser(email);
    console.log('hello');
    if (!user) {
      return done(undefined, false, { message: 'User not found' });
    }
    console.log('hello2');

    //Check Password
    comparePassword(password, user.password, (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: 'Invalid email or password' });
    });
  }),
);
