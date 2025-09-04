import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUser, FiFileText, FiLoader } from 'react-icons/fi';

function AnswerPage() {
  const [answers, setAnswers] = useState([]);
  const [groupedAnswers, setGroupedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/api/answers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setAnswers(res.data);
        const grouped = res.data.reduce((acc, answer) => {
          const { userId, username = `User ${userId.substring(0, 6)}` } = answer;
          if (!acc[userId]) acc[userId] = { answers: [], username };
          acc[userId].answers.push(answer);
          return acc;
        }, {});
        setGroupedAnswers(grouped);
        
        // Initialize expanded state
        const initialExpanded = {};
        Object.keys(grouped).forEach(userId => {
          initialExpanded[userId] = false;
        });
        setExpandedUsers(initialExpanded);
      } catch (err) {
        console.error('Failed to fetch answers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnswers();
  }, [token]);

  const toggleUserAnswers = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <FiLoader style={styles.spinnerIcon} />
        <p>Loading answers...</p>
      </div>
    );
  }

  if (Object.keys(groupedAnswers).length === 0) {
    return (
      <div style={styles.emptyState}>
        <FiFileText style={styles.emptyIcon} />
        <p>No answers submitted yet</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Student Answers</h1>
      <p style={styles.subtitle}>View all submitted exam answers</p>

      <div style={styles.answersContainer}>
        {Object.entries(groupedAnswers).map(([userId, { answers, username }]) => (
          <div key={userId} style={styles.userCard}>
            <div 
              style={styles.userHeader}
              onClick={() => toggleUserAnswers(userId)}
            >
              <FiUser style={styles.userIcon} />
              <h3 style={styles.userName}>{username}</h3>
              <span style={styles.answerCount}>
                {answers.length} {answers.length === 1 ? 'answer' : 'answers'}
              </span>
              <span style={styles.toggleIcon}>
                {expandedUsers[userId] ? '▼' : '►'}
              </span>
            </div>

            {expandedUsers[userId] && (
              <div style={styles.answersList}>
                {answers.map((answer) => (
                  <div key={answer._id} style={styles.answerCard}>
                    <h4 style={styles.questionTitle}>Question: {answer.questionId}</h4>
                    <div style={styles.answerContent}>
                      <p style={styles.answerText}>{answer.answerText}</p>
                      <p style={styles.answerMeta}>
                        Submitted on: {new Date(answer.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Inter', sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#497CAD',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '2rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    color: '#64748b',
  },
  spinnerIcon: {
    fontSize: '2rem',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    color: '#64748b',
  },
  emptyIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  answersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f1f5f9',
    },
  },
  userIcon: {
    fontSize: '1.5rem',
    color: '#52AAD0',
    marginRight: '1rem',
  },
  userName: {
    flex: 1,
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  answerCount: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: '500',
    marginRight: '1rem',
  },
  toggleIcon: {
    fontSize: '1rem',
    color: '#64748b',
  },
  answersList: {
    padding: '1.5rem',
    borderTop: '1px solid #f1f5f9',
  },
  answerCard: {
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: '#52AAD0',
    },
  },
  questionTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1e293b',
  },
  answerContent: {
    paddingLeft: '1rem',
    borderLeft: '2px solid #52AAD0',
  },
  answerText: {
    margin: '0 0 0.5rem 0',
    color: '#334155',
    lineHeight: '1.6',
  },
  answerMeta: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#64748b',
  },
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
};

export default AnswerPage;