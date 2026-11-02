// client/src/App.jsx (updated)
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import { authAPI } from './services/api';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

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
          window.history.replaceState({}, '', '/');
        });
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="auth-container">
      <h1 className="app-title">Secure App</h1>
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