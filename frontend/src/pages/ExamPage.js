import React, { useEffect, useState, useCallback } from 'react'; 
import axios from 'axios';
import { FiMic, FiArrowLeft, FiArrowRight, FiVolume2, FiCheck, FiBookOpen } from 'react-icons/fi';

function ExamPage() {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const [recognition, setRecognition] = useState(null);
  const [completedSound] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  // Move voice recognition functions outside useEffect
  const startVoiceRecognition = useCallback(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Speech Recognition API is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.lang = 'en-US';
    recognitionInstance.interimResults = false;

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswers((prev) => ({
        ...prev,
        [questions[currentIndex]._id]: transcript,
      }));
    };

    recognitionInstance.onerror = () => {
      alert('Voice recognition failed. Please try again.');
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
  }, [currentIndex, questions]);

  const stopVoiceRecognition = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsListening(false);
  }, [recognition]);

  useEffect(() => {
    // Fetch available papers
    setIsLoading(true);
    axios
      .get('http://localhost:5000/api/papers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPapers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert('Failed to load papers');
        setIsLoading(false);
      });
  }, [token]);
  
  // Fetch questions when a paper is selected
  useEffect(() => {
    if (selectedPaper) {
      setIsLoading(true);
      axios
        .get(`http://localhost:5000/api/papers/${selectedPaper._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setQuestions(res.data.questions);
          setIsLoading(false);
        })
        .catch((err) => {
          alert('Failed to load questions for this paper');
          setIsLoading(false);
        });
    }
  }, [selectedPaper, token]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control' && !isListening) {
        startVoiceRecognition();
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (e.key === ' ') {
        e.preventDefault();
        if (questions[currentIndex]) {
          const { text, type, options } = questions[currentIndex];
          let questionText = `Question ${currentIndex + 1}: ${text}`;
          if (type === 'mcq' && options && options.length > 0) {
            questionText += `. Options are: ${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join(', ')}`;
          }
          speak(questionText);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        stopVoiceRecognition();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (recognition) {
        recognition.stop();
      }
    };
  }, [questions, currentIndex, isListening, startVoiceRecognition, stopVoiceRecognition, recognition]);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const submitAnswer = async (questionId) => {
    setIsSubmitting(true);
    try {
      await axios.post(
        'http://localhost:5000/api/answers',
        {
          questionId,
          paperId: selectedPaper._id,
          answerText: answers[questionId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Play completion sound
      completedSound.play();
      
      // Move to next question if not the last one
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'You may have already answered');
    } finally {
      setIsSubmitting(false);
    }
  };
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Paper selection screen
  if (!selectedPaper) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Select a Question Paper</h2>
        </div>
        
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading available papers...</p>
          </div>
        ) : papers.length === 0 ? (
          <div style={styles.emptyState}>
            <FiBookOpen style={styles.emptyStateIcon} />
            <p>No question papers available</p>
          </div>
        ) : (
          <div style={styles.paperGrid}>
            {papers.map(paper => (
              <div 
                key={paper._id} 
                style={styles.paperCard}
                onClick={() => setSelectedPaper(paper)}
              >
                <h3 style={styles.paperTitle}>{paper.title}</h3>
                <p style={styles.paperDescription}>{paper.description}</p>
                <p style={styles.paperQuestionCount}>
                  {paper.questions.length} Questions
                </p>
                <button style={styles.startButton}>Start Exam</button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isLoading || questions.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>{selectedPaper.title}</h2>
        <p style={styles.paperSubtitle}>{selectedPaper.description}</p>
        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${progressPercentage}%`
              }}
            ></div>
          </div>
          <p style={styles.progressText}>
            {answeredCount}/{totalQuestions} questions answered ({progressPercentage}%)
          </p>
        </div>
      </div>

      <div style={styles.examContainer}>
        <div style={styles.questionNav}>
          {questions.map((question, index) => (
            <button
              key={question._id}
              style={{
                ...styles.navButton,
                ...(index === currentIndex && styles.navButtonActive),
                ...(answers[question._id] && styles.navButtonAnswered)
              }}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
              {answers[question._id] && <FiCheck style={styles.checkIcon} />}
            </button>
          ))}
        </div>

        <div style={styles.questionContainer}>
          <div style={styles.questionHeader}>
            <h3 style={styles.questionTitle}>
              Question {currentIndex + 1}
            </h3>
            <button 
              onClick={() => {
                const { text, type, options } = questions[currentIndex];
                let questionToSpeak = `Question ${currentIndex + 1}: ${text}`;
                if (type === 'mcq' && options && options.length > 0) {
                  questionToSpeak += `. Options are: ${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join(', ')}`;
                }
                speak(questionToSpeak);
              }}
              style={styles.speakButton}
            >
              <FiVolume2 /> Read Question
            </button>
          </div>
          
          <p style={styles.questionText}>{currentQuestion.text}</p>
          {currentQuestion.type === 'mcq' && currentQuestion.options && currentQuestion.options.length > 0 && (
            <div style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <p key={index} style={styles.optionText}>
                  {String.fromCharCode(65 + index)}. {option}
                </p>
              ))}
            </div>
          )}
          
          <div style={styles.answerContainer}>
            <div style={styles.answerInputContainer}>
              {currentQuestion.type === 'mcq' && currentQuestion.answer && (
                <p style={styles.mcqAnswer}>Correct Answer: {currentQuestion.answer}</p>
              )}
              <input
                type="text"
                placeholder="Type your answer here..."
                value={answers[currentQuestion._id] || ''}
                onChange={(e) =>
                  setAnswers({ ...answers, [currentQuestion._id]: e.target.value })
                }
                style={styles.answerInput}
              />
              <button 
                onClick={() => {
                  if (!isListening) {
                    startVoiceRecognition();
                  } else {
                    stopVoiceRecognition();
                  }
                }}
                style={{
                  ...styles.voiceButton,
                  ...(isListening && styles.voiceButtonActive)
                }}
              >
                <FiMic /> {isListening ? 'Listening...' : 'Voice Answer'}
              </button>
            </div>
            
            <div style={styles.actionButtons}>
              <button 
                onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                style={styles.navActionButton}
                disabled={currentIndex === 0}
              >
                <FiArrowLeft /> Previous
              </button>
              
              <button 
                onClick={() => submitAnswer(currentQuestion._id)}
                style={styles.submitButton}
                disabled={!answers[currentQuestion._id] || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
              
              {currentIndex === questions.length - 1 ? (
                <button 
                  onClick={() => window.location.href = '/exam'}
                  style={styles.navActionButton}
                >
                  Finish Exam <FiCheck />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                  style={styles.navActionButton}
                  disabled={currentIndex === questions.length - 1}
                >
                  Next <FiArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.instructions}>
        <h4 style={styles.instructionsTitle}>Quick Controls</h4>
        <ul style={styles.instructionsList}>
          <li><strong>Left/Right Arrow:</strong> Navigate between questions</li>
          <li><strong>Space Bar:</strong> Hear the current question</li>
          <li><strong>Control Key:</strong> Hold to answer using voice</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  paperGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  paperCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    },
  },
  paperTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#497CAD',
    marginTop: 0,
    marginBottom: '1rem',
  },
  paperDescription: {
    fontSize: '0.95rem',
    color: '#64748b',
    marginBottom: '1.5rem',
    flex: 1,
  },
  paperQuestionCount: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    marginBottom: '1.5rem',
  },
  startButton: {
    backgroundColor: '#52AAD0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 0',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    width: '100%',
    ':hover': {
      backgroundColor: '#497CAD',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  emptyStateIcon: {
    fontSize: '3rem',
    color: '#94a3b8',
    marginBottom: '1rem',
  },
  paperSubtitle: {
    fontSize: '1rem',
    color: '#64748b',
    marginTop: '-0.5rem',
    marginBottom: '1.5rem',
  },
  container: {
    fontFamily: "'Inter', sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    color: '#1e293b',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#497CAD',
    marginBottom: '1rem',
  },
  progressContainer: {
    marginBottom: '1.5rem',
  },
  progressBar: {
    height: '10px',
    backgroundColor: '#e2e8f0',
    borderRadius: '5px',
    marginBottom: '0.5rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#52AAD0',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  examContainer: {
    display: 'flex',
    gap: '2rem',
    marginBottom: '2rem',
  },
  questionNav: {
    flex: '0 0 80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navButton: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s',
    fontSize: '1rem',
    fontWeight: '500',
    ':hover': {
      borderColor: '#52AAD0',
    },
  },
  navButtonActive: {
    borderColor: '#497CAD',
    backgroundColor: '#497CAD',
    color: 'white',
  },
  navButtonAnswered: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
    color: '#166534',
  },
  checkIcon: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    fontSize: '0.8rem',
    color: '#166534',
  },
  questionContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  questionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  speakButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.9rem',
    ':hover': {
      backgroundColor: '#f1f5f9',
    },
  },
  questionText: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    marginBottom: '2rem',
  },
  optionsContainer: {
    marginBottom: '2rem',
  },
  optionText: {
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '0.5rem',
    color: '#334155',
  },
  answerContainer: {
    marginTop: '2rem',
  },
  answerInputContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  answerInput: {
    flex: 1,
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
  mcqAnswer: {
    margin: '0.5rem 0',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#28a745',
  },
  voiceButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '0 1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f1f5f9',
    },
  },
  voiceButtonActive: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
    color: '#dc2626',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  navActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '0.95rem',
    ':hover': {
      backgroundColor: '#f1f5f9',
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  submitButton: {
    flex: 1,
    maxWidth: '300px',
    backgroundColor: '#52AAD0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    margin: '0 auto',
    ':hover': {
      backgroundColor: '#497CAD',
    },
    ':disabled': {
      backgroundColor: '#cbd5e1',
      cursor: 'not-allowed',
    },
  },
  instructions: {
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '1.5rem',
    marginTop: '2rem',
  },
  instructionsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: 0,
    marginBottom: '1rem',
    color: '#334155',
  },
  instructionsList: {
    margin: 0,
    paddingLeft: '1.5rem',
    lineHeight: '1.8',
    color: '#64748b',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: "'Inter', sans-serif",
  },
  loadingSpinner: {
    border: '4px solid #f1f5f9',
    borderTop: '4px solid #52AAD0',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default ExamPage;