require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const { clientUrl, serverUrl } = require('./config/urls');

const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');

const app = express();

const allowedOrigins = [
  clientUrl,
  serverUrl,
  'https://secure-app-iota.vercel.app',
  'https://secure-app-s3de.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or same-origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

module.exports = app;
