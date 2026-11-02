// server/src/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const { googleCallbackUrl } = require('./urls');

const prisma = new PrismaClient();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: googleCallbackUrl,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (user) {
          // Existing user -- return them
          return done(null, user);
        }

        // Check if a user with this email already exists
        // (they may have registered with email/password first)
        const email = profile.emails[0].value;
        user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          // Link Google account to existing user
          user = await prisma.user.update({
            where: { email },
            data: {
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value,
            },
          });
          return done(null, user);
        }

        // New user -- create account
        user = await prisma.user.create({
          data: {
            email,
            name: profile.displayName,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            // No passwordHash -- this is an OAuth user
          },
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;