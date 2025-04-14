import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Welcome to Real-Time Chat</h2>
        </div>
        <div className="card-content">
          <p className="text-white">Redirecting you to the chat...</p>
        </div>
      </div>
    </div>
  );
}