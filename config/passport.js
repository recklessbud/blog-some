const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy
const LocalStrategy = require('passport-local')
const User = require("../model/userSchema")




passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    return done(null, await User.findById(id));
  } catch (error) {
    return done(error);
  }
});

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
        //   displayName: profile.displayName,
           username: profile.name.givenName,
        //   lastName: profile.name.familyName,
           image: profile.photos[0].value,
        } 

        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
    )

    passport.use(
      new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
        User.findOne({ email: email.toLowerCase() })
          .then((user) => {
            if (!user) {
              return done(null, false, { msg: `Email ${email} not found.` });
            }
            if (!user.password) {
              return done(null, false, {
                msg: "Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.",
              });
            }
            user.comparePassword(password, (err, isMatch) => {
              if (err) {
                return done(err);
              }
              if (isMatch) {
                return done(null, user);
              }
              return done(null, false, { msg: "Invalid email or password." });
            });
          })
          .catch((err) => done(err));
      })
    );
