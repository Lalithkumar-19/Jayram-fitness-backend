const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
// Password contains special character '@' which needs to be encoded as '%40'
mongoose.connect("mongodb+srv://talktoonlyus:Chegg%40143@cluster0.ygtjpfs.mongodb.net/?appName=Cluster0")
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
