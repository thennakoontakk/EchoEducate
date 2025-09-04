import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSave, FiPlus, FiX, FiList } from 'react-icons/fi';

function PaperManagementPage({ onBack }) {
  const [papers, setPapers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPapers();
    fetchQuestions();
  }, []);

  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/papers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPapers(res.data);
    } catch (error) {
      alert('Failed to fetch papers');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/questions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    } catch (error) {
      alert('Failed to fetch questions');
    }
  };

  const handleAddOrEdit = async () => {
    if (!title.trim()) {
      alert('Paper title is required');
      return;
    }

    const payload = {
      title,
      description,
      questions: selectedQuestions,
    };

    try {
      setIsLoading(true);
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/papers/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/papers',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchPapers();
      clearForm();
    } catch (error) {
      alert(editingId ? 'Failed to update paper' : 'Failed to add paper');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:5000/api/papers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPapers();
      } catch (error) {
        alert('Failed to delete paper');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
    setSelectedQuestions([]);
    setShowQuestionSelector(false);
  };

  const handleEdit = (paper) => {
    setTitle(paper.title);
    setDescription(paper.description || '');
    setSelectedQuestions(paper.questions.map(q => q._id || q));
    setEditingId(paper._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Manage Question Papers</h2>
        {onBack && (
          <button onClick={onBack} style={styles.backButton}>
            Back to Dashboard
          </button>
        )}
      </div>

      <div style={styles.formContainer}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Paper Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="Enter paper title"
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            placeholder="Enter paper description (optional)"
            rows="3"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Questions:</label>
          <button 
            onClick={() => setShowQuestionSelector(!showQuestionSelector)}
            style={styles.questionSelectorButton}
          >
            <FiList style={styles.buttonIcon} />
            {showQuestionSelector ? 'Hide Question Selector' : 'Show Question Selector'}
          </button>
          
          {showQuestionSelector && (
            <div style={styles.questionSelector}>
              <h4 style={styles.selectorTitle}>Select Questions for this Paper</h4>
              <div style={styles.questionList}>
                {questions.map((question) => (
                  <div 
                    key={question._id} 
                    style={{
                      ...styles.questionItem,
                      ...(selectedQuestions.includes(question._id) ? styles.selectedQuestion : {})
                    }}
                    onClick={() => toggleQuestionSelection(question._id)}
                  >
                    <div style={styles.questionText}>
                      <span style={styles.questionType}>{question.type.toUpperCase()}</span>
                      {question.text}
                    </div>
                    <div style={styles.questionCheck}>
                      {selectedQuestions.includes(question._id) ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
              <div style={styles.selectedCount}>
                {selectedQuestions.length} questions selected
              </div>
            </div>
          )}
        </div>

        <div style={styles.buttonContainer}>
          <button
            onClick={handleAddOrEdit}
            style={styles.saveButton}
            disabled={isLoading}
          >
            <FiSave style={styles.buttonIcon} />
            {editingId ? 'Update Paper' : 'Create Paper'}
          </button>
          {editingId && (
            <button onClick={clearForm} style={styles.cancelButton}>
              <FiX style={styles.buttonIcon} />
              Cancel
            </button>
          )}
        </div>
      </div>

      <div style={styles.papersList}>
        <h3 style={styles.sectionTitle}>Existing Papers</h3>
        {papers.length === 0 ? (
          <p style={styles.noPapers}>No papers created yet</p>
        ) : (
          papers.map((paper) => (
            <div key={paper._id} style={styles.paperCard}>
              <div style={styles.paperHeader}>
                <h3 style={styles.paperTitle}>{paper.title}</h3>
                <div style={styles.paperActions}>
                  <button
                    onClick={() => handleEdit(paper)}
                    style={styles.actionButton}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(paper._id)}
                    style={styles.actionButton}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              {paper.description && (
                <p style={styles.paperDescription}>{paper.description}</p>
              )}
              <div style={styles.questionCount}>
                {paper.questions.length} questions
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    margin: 0,
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    resize: 'vertical',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  buttonIcon: {
    fontSize: '18px',
  },
  papersList: {
    marginTop: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '15px',
  },
  noPapers: {
    color: '#666',
    fontStyle: 'italic',
  },
  paperCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  paperHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paperTitle: {
    margin: 0,
    fontSize: '18px',
  },
  paperActions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#555',
  },
  paperDescription: {
    margin: '10px 0',
    color: '#666',
  },
  questionCount: {
    fontSize: '14px',
    color: '#888',
    marginTop: '10px',
  },
  questionSelectorButton: {
    padding: '10px 15px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '10px',
  },
  questionSelector: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '15px',
    marginTop: '10px',
  },
  selectorTitle: {
    margin: '0 0 15px 0',
    fontSize: '16px',
  },
  questionList: {
    maxHeight: '300px',
    overflowY: 'auto',
    border: '1px solid #eee',
    borderRadius: '4px',
  },
  questionItem: {
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedQuestion: {
    backgroundColor: '#e3f2fd',
  },
  questionText: {
    flex: 1,
  },
  questionType: {
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    fontSize: '12px',
    marginRight: '8px',
  },
  questionCheck: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  selectedCount: {
    marginTop: '10px',
    textAlign: 'right',
    fontSize: '14px',
    color: '#666',
  },
};

export default PaperManagementPage;