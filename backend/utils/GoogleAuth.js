const passport=require('passport');
const googleStrategy=require("passport-google-oauth20").Strategy;
const User=require('../models/User')
passport.use(
    new googleStrategy({
        clientID:process.env.GOOGLE_CILENT_ID,
        clientSecret:process.env.GOOGLE_CILENT_SECRET,
        callbackURL:process.env.CALLBACK_URL
    },
     async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
             hasvehicle: "no",
            password: "",
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
)
);
passport.serializeUser((user,done)=>{
    done(null,user.id);
})
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});