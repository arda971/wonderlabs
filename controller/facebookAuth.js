var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_OAUTH_TEST_APP_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_OAUTH_TEST_APP_CLIENT_SECRET,
    callbackURL: "https://wonder971.herokuapp.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('Our user authenticated with Facebook, and Facebook sent us back this profile info identifying the authenticated user:', profile);
    return done(null, profile);
  },
  
));

module.exports = passport;
