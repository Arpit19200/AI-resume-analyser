const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  originalFilename: String,
  overallScore: Number,
  sectionScores: {
    education: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    formatting: { type: Number, default: 0 }
  },
  strengths: [String],
  weaknesses: [String],
  suggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
