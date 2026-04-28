import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import AnalysisReport from './components/AnalysisReport';
import './index.css';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleUploadStart = () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
  };

  const handleUploadSuccess = (data) => {
    setAnalysisResult(data);
    setIsAnalyzing(false);
  };

  const handleUploadError = (errMessage) => {
    setError(errMessage);
    setIsAnalyzing(false);
  };

  return (
    <div className="container">
      <header>
        <h1>AI Resume Analyzer</h1>
        <p className="subtitle">Upload your resume and get instant, AI-driven feedback to land your dream job.</p>
      </header>

      {!analysisResult ? (
        <UploadSection 
          onUploadStart={handleUploadStart}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          isAnalyzing={isAnalyzing}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <button 
            className="analyze-btn" 
            style={{ alignSelf: 'flex-start' }}
            onClick={() => setAnalysisResult(null)}
          >
            Analyze Another Resume
          </button>
          <AnalysisReport data={analysisResult} />
        </div>
      )}

      {error && (
        <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', color: 'var(--danger)', textAlign: 'center' }}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
