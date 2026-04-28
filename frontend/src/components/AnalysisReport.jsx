import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

const ScoreBar = ({ label, score }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Small delay to allow animation to trigger
    const timeout = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const getColor = (s) => {
    if (s >= 80) return 'var(--success)';
    if (s >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="score-bar-container">
      <div className="score-bar-header">
        <span>{label}</span>
        <span>{score}/100</span>
      </div>
      <div className="score-bar-bg">
        <div 
          className="score-bar-fill" 
          style={{ width: `${width}%`, backgroundColor: getColor(score) }} 
        />
      </div>
    </div>
  );
};

const AnalysisReport = ({ data }) => {
  if (!data) return null;

  const { overallScore, sectionScores, strengths, weaknesses, suggestions } = data;

  return (
    <div className="report-container">
      {/* Overview Section */}
      <div className="glass-panel score-overview">
        <div className="overall-score">
          <div className="score-circle" style={{ '--score': overallScore }}>
            <span>{overallScore}</span>
          </div>
          <div className="score-label">Overall ATS Score</div>
        </div>
        
        <div className="section-scores">
          {sectionScores && Object.entries(sectionScores).map(([key, value]) => (
            <ScoreBar 
              key={key} 
              label={key.charAt(0).toUpperCase() + key.slice(1)} 
              score={value} 
            />
          ))}
        </div>
      </div>

      {/* Feedback Grid */}
      <div className="feedback-grid">
        <div className="glass-panel feedback-card">
          <h3 className="strengths"><CheckCircle size={24} /> Strengths</h3>
          <ul className="feedback-list">
            {strengths?.length > 0 ? strengths.map((item, idx) => (
              <li key={idx}>{item}</li>
            )) : <li>No particular strengths identified.</li>}
          </ul>
        </div>

        <div className="glass-panel feedback-card">
          <h3 className="weaknesses"><AlertTriangle size={24} /> Areas to Improve</h3>
          <ul className="feedback-list">
            {weaknesses?.length > 0 ? weaknesses.map((item, idx) => (
              <li key={idx}>{item}</li>
            )) : <li>No major weaknesses found!</li>}
          </ul>
        </div>
      </div>

      <div className="glass-panel feedback-card" style={{ gridColumn: '1 / -1' }}>
        <h3 className="suggestions"><Lightbulb size={24} /> Actionable Suggestions</h3>
        <ul className="feedback-list">
          {suggestions?.length > 0 ? suggestions.map((item, idx) => (
            <li key={idx}>{item}</li>
          )) : <li>Your resume looks great! Keep it up.</li>}
        </ul>
      </div>
    </div>
  );
};

export default AnalysisReport;
