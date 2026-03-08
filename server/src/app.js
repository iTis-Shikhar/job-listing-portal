const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobSeekerProfileRoutes = require('./routes/jobSeekerProfileRoutes');
const employerProfileRoutes = require('./routes/employerProfileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Connect to database
const connectDB = require('./config/db');
connectDB();

app.use(express.json());

// Validate CLIENT_URL at startup — fail fast rather than silently allowing all origins
if (!process.env.CLIENT_URL) {
    throw new Error(
        'set client url '
    );
}
// Build list of allowed origins from env, stripping any trailing slashes
const allowedOrigins = [
    process.env.CLIENT_URL?.replace(/\/+$/, ''),
    'http://localhost:5173',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow server-to-server requests (no origin) and whitelisted origins
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile/jobseeker', jobSeekerProfileRoutes);
app.use('/api/profile/employer', employerProfileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

module.exports = app;
