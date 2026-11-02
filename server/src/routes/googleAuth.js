// server/src/routes/googleAuth.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { clientUrl } = require('../config/urls');

const router = express.Router();

// Step 1: Redirect to Google's consent screen
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// Step 2: Google redirects back here with the authorization code
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${clientUrl}/?error=google-auth-failed`,
  }),
  (req, res) => {
    // Passport attaches the user to req.user after successful authentication
    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Redirect to the frontend with the token
    // The frontend will extract the token from the URL and store it
    res.redirect(`${clientUrl}/auth/callback?token=${token}`);
  }
);

module.exports = router;