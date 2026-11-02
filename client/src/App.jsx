// client/src/App.jsx
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import { authAPI } from './services/api';
import './App.css';

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [oauthError, setOauthError] = useState('');

  // Handle OAuth callback & URL error params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error === 'google-auth-failed') {
      setOauthError('Google sign-in was cancelled or failed. Please try again.');
      window.history.replaceState({}, '', '/');
    }

    if (token && window.location.pathname === '/auth/callback') {
      localStorage.setItem('token', token);

      authAPI.getMe()
        .then((response) => {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          window.history.replaceState({}, '', '/');
          window.location.reload();
        })
        .catch(() => {
          localStorage.removeItem('token');
          setOauthError('Failed to complete sign-in. Please log in again.');
          window.history.replaceState({}, '', '/');
        });
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user) {
    if (currentView === 'profile') {
      return (
        <Profile
          onBack={() => setCurrentView('dashboard')}
          onLogout={logout}
        />
      );
    }
    return (
      <Dashboard
        onOpenProfile={() => setCurrentView('profile')}
        onLogout={logout}
      />
    );
  }

  return (
    <div className="auth-container">
      <h1 className="app-title">Secure App</h1>
      {oauthError && (
        <div className="error-message" style={{ marginBottom: '16px' }}>
          {oauthError}
        </div>
      )}
      {showRegister ? (
        <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
