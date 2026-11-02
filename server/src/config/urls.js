const trimTrailingSlashes = (url) => (url ? url.replace(/\/+$/, '') : '');

const isProduction = process.env.NODE_ENV === 'production';

const defaultClientUrl = isProduction
  ? 'https://secure-app-iota.vercel.app'
  : 'http://localhost:5173';

const defaultServerUrl = isProduction
  ? 'https://secure-app-s3de.vercel.app'
  : 'http://localhost:4000';

const clientUrl = trimTrailingSlashes(
  process.env.CLIENT_URL || defaultClientUrl
);

const serverUrl = trimTrailingSlashes(
  process.env.SERVER_URL || defaultServerUrl
);

const googleCallbackUrl = trimTrailingSlashes(
  process.env.GOOGLE_CALLBACK_URL || `${serverUrl}/api/auth/google/callback`
);

module.exports = {
  clientUrl,
  serverUrl,
  googleCallbackUrl,
};
