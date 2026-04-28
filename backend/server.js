const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string_here') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));
} else {
  console.log('MONGODB_URI is not set or is using placeholder. Skipping MongoDB connection for now.');
}

const resumeRoutes = require('./routes/resumeRoutes');
app.use('/api/resume', resumeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Keep process alive if it's somehow exiting early
setInterval(() => {}, 1000 * 60 * 60);
