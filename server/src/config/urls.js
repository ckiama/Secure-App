const trimTrailingSlashes = (url) => url.replace(/\/+$/, '');

const defaultClientUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://secure-app-iota.vercel.app'
    : 'http://localhost:5173';
const clientUrl = trimTrailingSlashes(
  process.env.CLIENT_URL || defaultClientUrl
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
