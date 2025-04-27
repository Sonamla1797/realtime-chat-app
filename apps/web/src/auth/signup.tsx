import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname.includes('vercel.app')) {
      setIsPreview(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // 👇 Create name by combining firstName and lastName
    const { firstName, lastName, email, phoneNumber, password } = formData;
    const name = `${firstName.trim()} ${lastName.trim()}`;

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email,password, phoneNumber  }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Signup successful:', data);
      navigate('/chat');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Create an Account 🎉</h2>
            {isPreview && (
              <div className="demo-mode-indicator">
                Demo Mode: Enter any information
              </div>
            )}
          </div>
          <div className="card-content">
            <form onSubmit={handleSignup}>
              {error && <p className="text-red-500 mb-3">{error}</p>}

              {['firstName', 'lastName', 'email', 'phoneNumber'].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field} className="form-label">
                    {field === 'email'
                      ? 'Email'
                      : field === 'phoneNumber'
                      ? 'Phone Number'
                      : field === 'firstName'
                      ? 'First Name'
                      : 'Last Name'}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    placeholder={field.replace(/([A-Z])/g, ' $1')}
                    required
                    className="form-input"
                  />
                </div>
              ))}

              {['password', 'confirmPassword'].map((field) => (
                <div className="form-group" key={field}>
                  <label htmlFor={field} className="form-label">
                    {field === 'confirmPassword' ? 'Confirm Password' : 'Password'}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="password"
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    placeholder={field === 'confirmPassword' ? 'Confirm Password' : 'Password'}
                    required
                    className="form-input"
                  />
                </div>
              ))}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>

              <div className="text-center text-white mt-4">
                Already have an account?{' '}
                <Link to="/login" className="link">
                  Login here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
