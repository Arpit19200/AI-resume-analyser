const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');
const Resume = require('../models/Resume');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ error: 'GEMINI_API_KEY is not set in backend .env' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 1. Parse PDF
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    // 2. Prompt Gemini AI
    const prompt = `
      You are an expert ATS (Applicant Tracking System) and senior tech recruiter.
      Analyze the following resume text and provide a strict, JSON-formatted output.
      DO NOT include markdown block characters like \`\`\`json or \`\`\`. 
      Return ONLY a raw JSON object with the following structure:
      {
        "overallScore": number (0-100),
        "sectionScores": {
          "education": number (0-100),
          "experience": number (0-100),
          "skills": number (0-100),
          "projects": number (0-100),
          "formatting": number (0-100)
        },
        "strengths": ["array of strings"],
        "weaknesses": ["array of strings"],
        "suggestions": ["array of strings (actionable improvements)"]
      }

      Resume Text:
      ${resumeText}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    let analysisResultText = response.text;
    
    // Clean up if it contains markdown formatting
    if (analysisResultText.startsWith('\`\`\`json')) {
      analysisResultText = analysisResultText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    }

    const analysisData = JSON.parse(analysisResultText.trim());

    // 3. Save to MongoDB (if connected)
    let newResume;
    if (require('mongoose').connection.readyState === 1) {
      newResume = new Resume({
        originalFilename: req.file.originalname,
        overallScore: analysisData.overallScore,
        sectionScores: analysisData.sectionScores,
        strengths: analysisData.strengths,
        weaknesses: analysisData.weaknesses,
        suggestions: analysisData.suggestions
      });
      await newResume.save();
    } else {
      // Create a mock document if MongoDB is not connected
      newResume = {
         _id: 'mock-id-' + Date.now(),
        originalFilename: req.file.originalname,
        overallScore: analysisData.overallScore,
        sectionScores: analysisData.sectionScores,
        strengths: analysisData.strengths,
        weaknesses: analysisData.weaknesses,
        suggestions: analysisData.suggestions
      };
    }

    // 4. Return the result to the frontend
    res.status(200).json(newResume);

  } catch (error) {
    console.error('Error in uploadResume:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
};

module.exports = { uploadResume };
