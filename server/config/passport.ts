import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { IUser } from '../types';
import User from '../models/User';

// Declare module augmentation for passport
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

passport.serializeUser<IUser>((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/drive.file'
    ]
  },
  async (_req, accessToken, refreshToken, profile: Profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile?.emails?.[0]?.value,
          name: profile.displayName,
          picture: profile?.photos?.[0]?.value
        });
      }

      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();

      return done(null, user);
    } catch (error) {
      return done(error as Error, false);
    }
  }
));

export default passport; 