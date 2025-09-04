import React from 'react';
import LoginForm from '../components/LoginForm';
import { FaUserShield } from 'react-icons/fa';
import backgroundImage from '../assets/logo.jpeg';

function LoginPage() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.imageSection}>
        {/* <div style={styles.overlay}></div>
        <div style={styles.content}>
          <div style={styles.logoContainer}>
            <FaUserShield style={styles.logo} />
          </div>
          <h2 style={styles.imageTitle}>Welcome Back</h2>
          <p style={styles.subtitle}>Secure access to your dashboard</p>
        </div> */}
      </div>
      <div style={styles.formSection}>
        <LoginForm />
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  imageSection: {
    flex: 1,
    backgroundImage: ` url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    position: 'relative',
  },
  
  content: {
    zIndex: 2,
    textAlign: 'center',
    padding: '2rem',
    maxWidth: '600px',
  },
  
  logo: {
    fontSize: '2.5rem',
    color: 'white',
  },
  imageTitle: {
    fontSize: '2.5rem',logoContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto 2rem',
      backdropFilter: 'blur(5px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    fontWeight: '700',
    marginBottom: '1rem',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: 0.9,
    fontWeight: '300',
    marginBottom: '2rem',
  },
  formSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#EDF1F2',
  },
  '@media (max-width: 768px)': {
    pageContainer: {
      flexDirection: 'column',
    },
    imageSection: {
      padding: '2rem 1rem',
      flex: 'none',
      height: '200px',
    },
    content: {
      maxWidth: '100%',
    },
    imageTitle: {
      fontSize: '1.8rem',
    },
    subtitle: {
      fontSize: '1rem',
    },
  },
};

export default LoginPage;