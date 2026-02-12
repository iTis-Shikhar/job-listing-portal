const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();


const app = express();

// Connect to database
const connectDB = require('./config/db');
connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(5000, () => {
    console.log('http://localhost:5000');
});