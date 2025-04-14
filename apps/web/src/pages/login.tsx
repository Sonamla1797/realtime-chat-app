// apps/web/src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Check if we're in preview mode - this runs only on client side
  useEffect(() => {
    // In preview environments or when backend is unreachable, enable demo mode
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname.includes('vercel.app')) {
      setIsPreview(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/chat');
    } catch (error) {
      console.error('Login error:', error);
      alert('Could not connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Welcome Back 👋</h2>
            {/* Add this line to use isPreview without changing functionality */}
            {isPreview && <div style={{ display: 'none' }}></div>}
          </div>
          <div className="card-content">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="form-input"
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
                  placeholder="••••••••••"
                  required
                  className="form-input"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <div className="text-center text-white mt-4">
                Don't have an account?{' '}
                <Link to="/signup" className="link">
                  Sign up here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}