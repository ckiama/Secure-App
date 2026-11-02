import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import ChangePasswordForm from './ChangePasswordForm';

export default function Profile({ onBack, onLogout }) {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setError('');
    setIsDeleting(true);

    try {
      await authAPI.deleteAccount();
      onLogout();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <button type="button" className="back-button" onClick={onBack}>
            Back to Dashboard
          </button>
          <h1>Profile</h1>
        </div>
        <div className="user-info">
          <span>{user.name}</span>
          <button onClick={onLogout} className="logout-button">
            Log Out
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="card">
          <h2>Account Details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <ChangePasswordForm />

        <section className="card danger-card">
          <h2>Delete Account</h2>
          <p>Permanently delete your account and sign out. This action cannot be undone.</p>
          {error && <div className="error-message" role="alert">{error}</div>}
          <button
            type="button"
            className="delete-account-button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting account...' : 'Delete Account'}
          </button>
        </section>
      </main>
    </div>
  );
}
