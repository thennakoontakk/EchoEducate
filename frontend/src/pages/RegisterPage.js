import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div style={styles.pageContainer}>
      <RegisterForm />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDF1F2',
    fontFamily: "'Inter', sans-serif",
  },
};

export default RegisterPage;