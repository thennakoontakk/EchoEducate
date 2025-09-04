import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiUserPlus, FiArrowLeft } from 'react-icons/fi';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        role
      });
      alert('Registration successful');
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Try a different username.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.header}>
          <FiUserPlus style={styles.headerIcon} />
          <h2 style={styles.heading}>Create New Account</h2>
          <p style={styles.subheading}>Register as a new user</p>
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

        <div style={styles.formGroup}>
          <label style={styles.label}>Account Type</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="student">Student</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <button 
          type="submit" 
          style={styles.button}
          disabled={isLoading || !username || !password}
        >
          {isLoading ? 'Registering...' : 'Create Account'}
        </button>

        <div style={styles.footer}>
          <button 
            onClick={() => navigate('/')}
            style={styles.backButton}
            type="button"
          >
            <FiArrowLeft style={styles.buttonIcon} /> Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF1F2',
    padding: '2rem',
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  headerIcon: {
    fontSize: '2.5rem',
    color: '#52AAD0',
    marginBottom: '1rem',
  },
  heading: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
  },
  subheading: {
    fontSize: '1rem',
    color: '#64748b',
    margin: 0,
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
    textAlign: 'center',
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
    width: '75%',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    ':focus': {
      outline: 'none',
      borderColor: '#52AAD0',
      boxShadow: '0 0 0 3px rgba(82, 170, 208, 0.2)',
    },
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#334155',
  },
  select: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.95rem',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#52AAD0',
      boxShadow: '0 0 0 3px rgba(82, 170, 208, 0.2)',
    },
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
    marginTop: '0.5rem',
    ':hover': {
      backgroundColor: '#497CAD',
    },
    ':disabled': {
      backgroundColor: '#cbd5e1',
      cursor: 'not-allowed',
    },
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid #f1f5f9',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    margin: '0 auto',
    ':hover': {
      color: '#52AAD0',
    },
  },
  buttonIcon: {
    fontSize: '1rem',
  },
};

export default RegisterForm;