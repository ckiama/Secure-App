import { useState } from 'react';
import { authAPI } from '../services/api';

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess(response.data.message);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="card">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message" role="status">{success}</div>}

        <div className="form-group">
          <label htmlFor="currentPassword">Current password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmNewPassword">Confirm new password</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Changing password...' : 'Change Password'}
        </button>
      </form>
    </section>
  );
}
