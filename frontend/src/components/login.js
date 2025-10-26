import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setAuth(true);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
          <p className="text-secondary">AI-powered music recommendations</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Welcome Back</h2>
            <p className="card-subtitle">Sign in to your account</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <div className="flex items-center gap-sm">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-lg">
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
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <span>🔑</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-lg">
            <p className="text-secondary">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary font-semibold hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-xl text-center">
          <p className="text-sm text-muted mb-md">Experience the future of music discovery</p>
          <div className="flex justify-center gap-lg text-sm text-secondary">
            <div className="flex items-center gap-xs">
              <span>🎭</span>
              <span>Face Detection</span>
            </div>
            <div className="flex items-center gap-xs">
              <span>🤖</span>
              <span>AI Recommendations</span>
            </div>
            <div className="flex items-center gap-xs">
              <span>🎧</span>
              <span>Multi-language</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
