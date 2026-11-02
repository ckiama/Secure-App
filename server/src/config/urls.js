const trimTrailingSlashes = (url) => url.replace(/\/+$/, '');

const clientUrl = trimTrailingSlashes(
  process.env.CLIENT_URL || 'http://localhost:5173'
);
const serverUrl = trimTrailingSlashes(
  process.env.SERVER_URL ||
    (process.env.NODE_ENV === 'production' ? clientUrl : 'http://localhost:4000')
);

module.exports = {
  clientUrl,
  googleCallbackUrl:
    process.env.GOOGLE_CALLBACK_URL ||
    `${serverUrl}/api/auth/google/callback`,
};
