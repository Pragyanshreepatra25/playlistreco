import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        name
      });
      
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-md">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-md">
            <span className="text-2xl">🎵</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-sm">MusicReco</h1>
          <p className="text-secondary">Join the music revolution</p>
        </div>

        {/* Registration Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Create Account</h2>
            <p className="card-subtitle">Start your musical journey</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <div className="flex items-center gap-sm">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <div className="flex items-center gap-sm">
                <span>✅</span>
                <span>{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Create a strong password"
                disabled={isLoading}
                minLength="6"
              />
              <p className="text-xs text-muted mt-xs">
                Password must be at least 6 characters long
              </p>
            </div>

            <button 
              type="submit" 
              className="btn btn-success btn-full btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-lg">
            <p className="text-secondary">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary font-semibold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-xl">
          <div className="card">
            <h3 className="text-lg font-semibold text-center mb-md">What you'll get:</h3>
            <div className="space-y-sm">
              <div className="flex items-center gap-sm text-sm">
                <span className="text-green-500">✓</span>
                <span>AI-powered emotion detection</span>
              </div>
              <div className="flex items-center gap-sm text-sm">
                <span className="text-green-500">✓</span>
                <span>Personalized music recommendations</span>
              </div>
              <div className="flex items-center gap-sm text-sm">
                <span className="text-green-500">✓</span>
                <span>Multi-language playlist support</span>
              </div>
              <div className="flex items-center gap-sm text-sm">
                <span className="text-green-500">✓</span>
                <span>YouTube integration for instant playback</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
