import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSave, FiPlus, FiX } from 'react-icons/fi';

function ManagePaperPage({ onBack }) {
  const [questions, setQuestions] = useState([]);
  const [text, setText] = useState('');
  const [type, setType] = useState('text');
  const [options, setOptions] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/questions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (error) {
      alert('Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrEdit = async () => {
    const payload = {
      text,
      type,
      options: type === 'mcq' ? options.split(',').map((o) => o.trim()) : [],
    };

    try {
      setIsLoading(true);
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/questions/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/questions',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchQuestions();
      clearForm();
    } catch (error) {
      alert(editingId ? 'Failed to update question' : 'Failed to add question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:5000/api/questions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchQuestions();
      } catch (error) {
        alert('Failed to delete question');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearForm = () => {
    setText('');
    setType('text');
    setOptions('');
    setEditingId(null);
  };

  const handleEdit = (question) => {
    setText(question.text);
    setType(question.type);
    setOptions(question.options ? question.options.join(', ') : '');
    setEditingId(question._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {/* <h2 style={styles.title}>Manage Exam Questions</h2>
        <button onClick={onBack} style={styles.backButton}>
          Back to Dashboard
        </button> */}
      </div>

      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>
          {editingId ? 'Edit Question' : 'Add New Question'}
        </h3>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Question Text</label>
          <input
            style={styles.input}
            placeholder="Enter the question text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Question Type</label>
          <select 
            style={styles.select}
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="text">Text Answer</option>
            <option value="mcq">Multiple Choice (MCQ)</option>
          </select>
        </div>

        {type === 'mcq' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Options (comma separated)</label>
            <input
              style={styles.input}
              placeholder="Option 1, Option 2, Option 3"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
            />
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button 
            onClick={handleAddOrEdit}
            style={styles.primaryButton}
            disabled={!text || isLoading}
          >
            {isLoading ? (
              'Processing...'
            ) : editingId ? (
              <>
                <FiSave style={styles.buttonIcon} /> Update Question
              </>
            ) : (
              <>
                <FiPlus style={styles.buttonIcon} /> Add Question
              </>
            )}
          </button>
          
          {editingId && (
            <button 
              onClick={clearForm}
              style={styles.secondaryButton}
              disabled={isLoading}
            >
              <FiX style={styles.buttonIcon} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div style={styles.questionsCard}>
        <h3 style={styles.sectionTitle}>Question Bank</h3>
        
        {isLoading && questions.length === 0 ? (
          <div style={styles.loading}>Loading questions...</div>
        ) : questions.length === 0 ? (
          <div style={styles.emptyState}>No questions added yet</div>
        ) : (
          <div style={styles.questionsList}>
            {questions.map((question, index) => (
              <div key={question._id} style={styles.questionItem}>
                <div style={styles.questionContent}>
                  <p style={styles.questionText}>
                    <span style={styles.questionNumber}>Q{index + 1}:</span> {question.text}
                  </p>
                  <p style={styles.questionType}>Type: {question.type}</p>
                  {question.options && question.options.length > 0 && (
                    <p style={styles.questionOptions}>
                      Options: {question.options.join(', ')}
                    </p>
                  )}
                </div>
                <div style={styles.questionActions}>
                  <button 
                    onClick={() => handleEdit(question)}
                    style={styles.editButton}
                    disabled={isLoading}
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    onClick={() => handleDelete(question._id)}
                    style={styles.deleteButton}
                    disabled={isLoading}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#497CAD',
    margin: 0,
  },
  backButton: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginBottom: '2rem',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 0,
    marginBottom: '1.5rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#334155',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#52AAD0',
      boxShadow: '0 0 0 3px rgba(82, 170, 208, 0.2)',
    },
  },
  select: {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#52AAD0',
      boxShadow: '0 0 0 3px rgba(82, 170, 208, 0.2)',
    },
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#52AAD0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#497CAD',
    },
    ':disabled': {
      backgroundColor: '#cbd5e1',
      cursor: 'not-allowed',
    },
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  questionsCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 0,
    marginBottom: '1.5rem',
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#64748b',
    border: '1px dashed #e2e8f0',
    borderRadius: '8px',
  },
  questionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  questionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: '#52AAD0',
    },
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    margin: 0,
    marginBottom: '0.5rem',
    fontSize: '1.1rem',
    color: '#1e293b',
  },
  questionNumber: {
    fontWeight: '600',
    color: '#497CAD',
  },
  questionType: {
    margin: 0,
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    color: '#64748b',
  },
  questionOptions: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#64748b',
  },
  questionActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    backgroundColor: '#f0f9ff',
    color: '#52AAD0',
    border: '1px solid #bae6fd',
    borderRadius: '6px',
    padding: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e0f2fe',
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    padding: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#fee2e2',
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
};

export default ManagePaperPage;