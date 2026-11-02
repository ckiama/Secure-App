require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const { clientUrl } = require('./config/urls');

const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');

const app = express();
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? clientUrl
    : [...new Set([clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'])];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
