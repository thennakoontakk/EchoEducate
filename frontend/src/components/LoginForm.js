import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiArrowRight } from 'react-icons/fi';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      if (response.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/exam');
      }
    } catch (error) {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Sign In</h2>
          <p style={styles.description}>Enter your credentials to access your account</p>
        </div>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        <div style={styles.inputGroup}>
          <div style={styles.inputIcon}>
            <FiUser />
          </div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <div style={styles.inputIcon}>
            <FiLock />
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>
        
        <div style={styles.options}>
          <label style={styles.remember}>
            <input type="checkbox" style={styles.checkbox} />
            Remember me
          </label>
          <a href="" style={styles.forgotPassword}>Forgot password?</a>
        </div>
        
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? 'Signing in...' : (
            <>
              Sign In <FiArrowRight style={styles.buttonIcon} />
            </>
          )}
        </button>
{/*         
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account? <a href="/signup" style={styles.footerLink}>Sign up</a>
          </p>
        </div> */}
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '480px',
  },
  form: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    width: '100%',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#497CAD',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '0',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '1.5rem',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '1.1rem',
  },
  input: {
    padding: '0.875rem 1rem 0.875rem 3rem',
    width: '85%',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
  },
  inputFocus: {
    borderColor: '#6366f1',
    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)',
    backgroundColor: '#fff',
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  remember: {
    display: 'flex',
    alignItems: 'center',
    color: '#64748b',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '0.5rem',
    accentColor: '#6366f1',
  },
  forgotPassword: {
    color: '#497CAD',
    textDecoration: 'none',
    fontWeight: '500',
  },
  button: {
    padding: '0.875rem 1.5rem',
    backgroundColor: '#52AAD0',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonHover: {
    backgroundColor: '#497CAD',
    transform: 'translateY(-1px)',
  },
  buttonDisabled: {
    opacity: '0.7',
    cursor: 'not-allowed',
  },
  buttonIcon: {
    marginLeft: '0.5rem',
    fontSize: '1.1rem',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    color: '#64748b',
    fontSize: '0.9rem',
    marginBottom: '0',
  },
  footerLink: {
    color: '#6366f1',
    fontWeight: '500',
    textDecoration: 'none',
  },
};

export default LoginForm;