import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';

const UploadSection = ({ onUploadStart, onUploadSuccess, onUploadError, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (file.type !== 'application/pdf') {
      onUploadError('Please upload a PDF file.');
      return;
    }
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    onUploadStart();
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploadSuccess(response.data);
    } catch (err) {
      onUploadError(err.response?.data?.error || 'An error occurred during analysis.');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <div 
        className={`upload-container ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".pdf" 
          onChange={handleChange} 
          disabled={isAnalyzing}
        />
        
        {selectedFile ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <FileText size={64} color="var(--primary)" />
            <div className="upload-text">{selectedFile.name}</div>
            <div className="upload-hint">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <UploadCloud className="upload-icon" />
            <div className="upload-text">Drag & drop your resume PDF here</div>
            <div className="upload-hint">or click to browse from your computer</div>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <button 
          className="analyze-btn" 
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="spinner" size={20} />
              Analyzing with AI...
            </>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
