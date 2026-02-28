const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobSeekerProfileRoutes = require('./routes/jobSeekerProfileRoutes');
const employerProfileRoutes = require('./routes/employerProfileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// Connect to database
const connectDB = require('./config/db');
connectDB();

app.use(express.json());
app.use(cors());

// Serve static files for uploads (with basic security - only resumes)
app.use('/uploads/resumes', express.static(path.join(__dirname, '../uploads/resumes')));

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile/jobseeker', jobSeekerProfileRoutes);
app.use('/api/profile/employer', employerProfileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

module.exports = app;
