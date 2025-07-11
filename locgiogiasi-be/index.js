require('dotenv').config();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import configurations and utilities
const connectDatabase = require('./config/database');
const { createUploadsDirectory } = require('./utils/createDirectories');
const { createTempUploadDirectory } = require('./utils/createTempDirectory');
const { createDefaultAdmin } = require('./utils/createDefaultAdmin');

// Import routes and middleware
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// Initialize uploads directory
createUploadsDirectory();
createTempUploadDirectory();

// Connect to database
connectDatabase();

// Create default admin after database connection
setTimeout(createDefaultAdmin, 2000);

// Middleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || '*',
//   credentials: true
// }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to LocGioGiaSi API',
    version: '1.0.0',
    documentation: '/api'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
});