import React, { useState } from 'react';
import { FiHome, FiUserPlus, FiEdit, FiFileText, FiArrowLeft, FiBook } from 'react-icons/fi';
import QuestionManagementPage from './QuestionManagementPage';
import RegisterPage from './RegisterPage';
import AnswerPage from './AnswersPage';
import PaperManagementPage from './PaperManagementPage';

function AdminPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div style={styles.container}>
      {currentPage === 'dashboard' ? (
        <div style={styles.dashboard}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <div style={styles.menu}>
            <button 
              style={styles.menuButton}
              onClick={() => setCurrentPage('registerUser')}
            >
              <FiUserPlus style={styles.buttonIcon} />
              Register New User
            </button>
            <button 
              style={styles.menuButton}
              onClick={() => setCurrentPage('managePaper')}
            >
              <FiEdit style={styles.buttonIcon} />
              Manage Questions
            </button>
            <button 
              style={styles.menuButton}
              onClick={() => setCurrentPage('managePapers')}
            >
              <FiBook style={styles.buttonIcon} />
              Manage Question Papers
            </button>
            <button 
              style={styles.menuButton}
              onClick={() => setCurrentPage('viewAnswers')}
            >
              <FiFileText style={styles.buttonIcon} />
              View Student Answers
            </button>
          </div>
        </div>
      ) : (
        <div style={styles.contentContainer}>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            style={styles.backButton}
          >
            <FiArrowLeft style={styles.buttonIcon} />
            Back to Dashboard
          </button>
          
          {currentPage === 'registerUser' && (
            <div style={styles.pageContent}>
              <h2 style={styles.pageTitle}>User Registration</h2>
              <RegisterPage onBack={() => setCurrentPage('dashboard')} />
            </div>
          )}

          {currentPage === 'managePaper' && (
            <div style={styles.pageContent}>
              <h2 style={styles.pageTitle}>Question Management</h2>
              <QuestionManagementPage onBack={() => setCurrentPage('dashboard')} />
            </div>
          )}

          {currentPage === 'viewAnswers' && (
            <div style={styles.pageContent}>
              <h2 style={styles.pageTitle}>Student Answers</h2>
              <AnswerPage onBack={() => setCurrentPage('dashboard')} />
            </div>
          )}

          {currentPage === 'managePapers' && (
            <div style={styles.pageContent}>
              <h2 style={styles.pageTitle}>Question Papers Management</h2>
              <PaperManagementPage onBack={() => setCurrentPage('dashboard')} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '2rem',
  },
  dashboard: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#497CAD',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1.5rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    width: '100%',
    backgroundColor: '#52AAD0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#497CAD',
      transform: 'translateY(-2px)',
    },
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    padding: '2rem',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    marginBottom: '2rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '1rem',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  },
  pageContent: {
    padding: '1rem',
  },
  pageTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e2e8f0',
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
};

export default AdminPage;