const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo', // Explicitly use the v3 userinfo endpoint
        scope: ['profile', 'email'] // Ensure correct scopes are requested
      },    
      async (accessToken, refreshToken, profile, done) => {
        if (!profile) {
          return done(new Error('No profile returned from Google'), null);
        }
        //get the user data from google 
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          email: profile.emails[0].value
        }

        try {
          //find the user in our database 
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            //If user present in our database.
            done(null, user)
          } else {
            // if user is not preset in our database save user data to database.
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // used to deserialize the user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); 
      done(null, user); // Pass the user to done callback
    } catch (err) {
      done(err, null); // Handle the error
    }
  });
}