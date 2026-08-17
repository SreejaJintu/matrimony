import React from 'react';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Forgot Password Page</h1>
      <p>This is a placeholder for the forgot password functionality.</p>
      <Link to="/login">Back to Login</Link>
    </div>
  );
}