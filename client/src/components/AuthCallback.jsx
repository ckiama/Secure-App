// client/src/components/AuthCallback.jsx
import { useEffect } from 'react';
import { authAPI } from '../services/api';

export default function AuthCallback() {
  useEffect(() => {
    // Extract token from URL query parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Store the token
      localStorage.setItem('token', token);

      // Fetch the user's profile and update auth state
      authAPI.getMe()
        .then((response) => {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          // Redirect to dashboard
          window.location.href = '/';
        })
        .catch(() => {
          // Token was invalid
          localStorage.removeItem('token');
          window.location.href = '/?error=auth-failed';
        });
    } else {
      window.location.href = '/?error=no-token';
    }
  }, []);

  return (
    <div className="loading">
      <p>Completing sign-in...</p>
    </div>
  );
}